const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const assert = require('assert');

describe('Création de tâche', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('doit permettre de créer une nouvelle tâche', async () => {
    await driver.get('http://localhost:3000');

    // Connexion
    await driver.findElement(By.id('email')).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Attente de la page dashboard
    await driver.wait(until.urlContains('/dashboard'), 5000);

    // Attente du bouton "Nouvelle Tâche"
    const newTaskBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Nouvelle Tâche')]")),
      5000
    );
    await newTaskBtn.click();

    // Attente du champ "title"
    const titleInput = await driver.wait(
      until.elementLocated(By.id('title')),
      5000
    );
    await titleInput.sendKeys('Tâche Selenium');

    await driver.findElement(By.id('description')).sendKeys('Tâche testée par Selenium');

    // Soumettre
    const submitButton = await driver.findElement(
      By.css('form button[type="submit"]')
    );
    await submitButton.click();

    // Vérifier l’apparition de la tâche
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Selenium')]")),
      5000
    );

    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Selenium'));
  });
});
