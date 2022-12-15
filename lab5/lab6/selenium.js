const {Builder, Browser, By, Key, until, ActionChains} = require('selenium-webdriver');

(async function example() {
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    try {
        await driver.get('http://localhost:3000/start');
        try {
            await driver.wait(until.urlIs('123'), 2000)
        }
        catch{

        }
        try{
            await driver.findElement(By.xpath("//*[text()='СТОП']")).click()
        }
        catch {

        }
        await driver.wait(until.elementLocated(By.tagName('input')),2000)
        let elements = await driver.findElements(By.tagName('input'))
        await elements[0].sendKeys('01102021');
        await elements[1].sendKeys('0');
        await driver.findElement(By.xpath("//*[text()='СТАРТ']")).click()
        await driver.get('http://localhost:5173/login');
        await driver.findElement(By.id('input-0')).sendKeys('Никита');
        await driver.findElement(By.className('v-btn')).click();
        await driver.wait(until.elementLocated(By.id('date')))
        await driver.wait(until.elementTextIs(driver.findElement(By.id('date')),"Текущая дата: пн, 11 октября 2021 г."), 10000);
        await driver.findElement(By.xpath("//*[text()='AMD']")).click()
        await driver.wait(until.elementLocated(By.xpath("//*[text()='КУПИТЬ']")),2000)
        await driver.findElement(By.xpath("//*[text()='КУПИТЬ']")).click()
        await driver.wait(until.elementTextIs(driver.findElement(By.id('funds')),'Доступные средства: 195,38 $'),2000)
        await driver.wait(until.elementTextIs(driver.findElement(By.id('date')),"Текущая дата: пн, 15 ноября 2021 г."), 40000);
        await driver.findElement(By.xpath("//*[text()='ПРОДАТЬ']")).click()
        await driver.findElement(By.tagName('body')).sendKeys(Key.ESCAPE)
        await driver.wait(until.elementTextIs(driver.findElement(By.id('funds')),'Доступные средства: 343,38 $'),2000)
    } finally {
        await driver.quit();
    }
})();