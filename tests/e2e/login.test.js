const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const assert = require('assert');

describe('Test de connexion', function () {
  this.timeout(15000);

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('doit se connecter avec un utilisateur valide', async () => {
    await driver.get('http://localhost:3000');

    
    await driver.wait(until.elementLocated(By.id('email')), 5000);

    
    await driver.findElement(By.id('email')).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');

    
    await driver.findElement(By.css('button[type="submit"]')).click();


    await driver.wait(until.elementLocated(By.css('.task-list')), 10000);


    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/dashboard') || url.includes('/tasks'));
  });
});
