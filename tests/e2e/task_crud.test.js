const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const assert = require('assert');

describe('CRUD Tâches', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  const login = async () => {
    await driver.get('http://localhost:3000/login');

    await driver.findElement(By.id('email')).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains('/dashboard'), 5000);
  };

  it('Créer une tâche', async () => {
    await login();

    const newTaskBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Nouvelle Tâche')]")),
      5000
    );
    await newTaskBtn.click();


    await driver.wait(until.elementLocated(By.id('title')), 5000);
    await driver.findElement(By.id('title')).sendKeys('Tâche Test');
    await driver.findElement(By.id('description')).sendKeys('Ceci est une tâche testée automatiquement');

    const prioritySelect = await driver.findElement(By.id('priority'));
    await prioritySelect.sendKeys('Haute');


    try {
      const assignedTo = await driver.findElement(By.id('assignedTo'));
      await assignedTo.sendKeys('\ue015'); 
    } catch (e) {
    }

    await driver.findElement(By.css('form button[type="submit"]')).click();


    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Test')]")), 5000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Test'));
  });

  it('Éditer une tâche', async () => {
    await login();

    const editButton = await driver.wait(
      until.elementLocated(By.css('.btn-icon[title="Modifier"]')),
      5000
    );
    await editButton.click();

    const titleInput = await driver.wait(until.elementLocated(By.id('title')), 5000);
    await titleInput.clear();
    await titleInput.sendKeys('Tâche Modifiée');

    await driver.findElement(By.css('form button[type="submit"]')).click();

    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Modifiée')]")), 5000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Modifiée'));
  });

  it('Supprimer une tâche', async () => {
    await login();

    const taskTitleElement = await driver.wait(
      until.elementLocated(By.css('.task-title')),
      5000
    );
    const taskTitle = await taskTitleElement.getText();

    const deleteButton = await driver.findElement(By.css('.btn-icon[title="Supprimer"]'));
    await deleteButton.click();


    await driver.wait(until.alertIsPresent(), 3000);
    const alert = await driver.switchTo().alert();
    await alert.accept();

    await driver.sleep(1000); 

    const pageSource = await driver.getPageSource();
    assert.ok(!pageSource.includes(taskTitle));
  });
});
