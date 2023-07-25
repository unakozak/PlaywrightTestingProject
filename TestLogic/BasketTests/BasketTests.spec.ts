import { test, expect } from '@playwright/test';
import * as userData from '../../TestsData/TestData.json';
import { PageManager } from '../../ApplicationLogic/Pages/PageManager';

test.describe('Basket Tests', async () => {
    const numberPattern = /\d+(?=\s*)/g;

    test.beforeEach(async ({ page }) => {
        const pageManager = new PageManager(page);
        await page.goto('/login');
        await pageManager.loginPage.Login(userData.users.UserOne.login, userData.users.UserOne.password);
        await CleanBasket(page);
    });

    test.afterEach(async ({ page }) => {
        page.close();
    });

    test("TC01. Open an empty shopping basket. Basket page opened and URL have /basket", async ({ page, baseURL }) => {
        // Issue #01. When basket is empty, dropdown don`t appear
        const pageManager = new PageManager(page);
        await pageManager.basketPage.ClickOnBasketIcon();
        await ExpectOpenBasket({ pageManager, baseURL });
    });

    test("TC02. Open a basket with 1 non-sale item. Basket page opened and URL have /basket", async ({ page, baseURL }) => {
        const pageManager = new PageManager(page);
        const item = pageManager.basketPage.Elements.NonDiscountItem;
        const itemID = 1;
        const itemName = await (pageManager.basketPage.Elements.ItemName(item.nth(itemID))).textContent();
        const itemPrice = await (pageManager.basketPage.Elements.ItemPrice(item.nth(itemID))).textContent();
        await pageManager.basketPage.AddItemToBasket(item, itemID, itemID);
        await pageManager.basketPage.ClickOnBasketIcon();
        const basketItemPrice = await pageManager.basketPage.DropdownElements.BasketItemPrice.textContent();
        const basketPrice = await pageManager.basketPage.DropdownElements.BasketPrice.textContent();
        await expect(await pageManager.basketPage.DropdownElements.BasketItemName.textContent()).toEqual(itemName);
        await expect((basketItemPrice.match(numberPattern))[0]).toEqual((itemPrice.match(numberPattern))[0]);
        await expect((basketPrice.match(numberPattern))[0]).toEqual((itemPrice.match(numberPattern))[0]);
        await ExpectOpenBasket({ pageManager, baseURL });
    });

    test("TC03. Open a basket with 1 sale item. Basket page opened and URL have /basket.", async ({ page, baseURL }) => {
        // Issue #02. After adding discount item basket icon in header disappears 
        const pageManager = new PageManager(page);
        const item = pageManager.basketPage.Elements.DiscountItem;
        const itemID = 1;
        const itemName = await (pageManager.basketPage.Elements.ItemName(item.nth(itemID))).textContent();
        const itemPrice = await (pageManager.basketPage.Elements.ItemPrice(item.nth(itemID))).textContent();
        await pageManager.basketPage.AddItemToBasket(item, itemID, itemID);
        await pageManager.basketPage.ClickOnBasketIcon();
        const basketItemPrice = await pageManager.basketPage.DropdownElements.BasketItemPrice.textContent();
        const basketPrice = await pageManager.basketPage.DropdownElements.BasketPrice.textContent();
        await expect(await pageManager.basketPage.DropdownElements.BasketItemName.textContent()).toEqual(itemName);
        await expect((basketItemPrice.match(numberPattern))[0]).toEqual((itemPrice.match(numberPattern))[0]);
        await expect((basketPrice.match(numberPattern))[0]).toEqual((itemPrice.match(numberPattern))[0]);
        await ExpectOpenBasket({ pageManager, baseURL });
    });

    test("TC03A. Open a basket with 1 sale item. Basket page opened and URL have /basket.", async ({ page, baseURL }) => {
        // Issue #02. After adding discount item basket icon in header disappears 
        const pageManager = new PageManager(page);
        const item = pageManager.basketPage.Elements.DiscountItem
        const itemID = 1;
        const itemName = await (pageManager.basketPage.Elements.ItemName(item.nth(itemID))).textContent();
        const itemPrice = await (pageManager.basketPage.Elements.ItemPrice(item.nth(itemID))).textContent();
        await pageManager.basketPage.AddItemToBasket(item, itemID, itemID);
        await pageManager.basketPage.ClickOnBasketLink();
        const basketItemPrice = await pageManager.basketPage.DropdownElements.BasketItemPrice.textContent();
        const basketPrice = await pageManager.basketPage.DropdownElements.BasketPrice.textContent();
        await expect(await pageManager.basketPage.DropdownElements.BasketItemName.textContent()).toEqual(itemName);
        await expect((basketItemPrice.match(numberPattern))[0]).toEqual((itemPrice.match(numberPattern))[0]);
        await expect((basketPrice.match(numberPattern))[0]).toEqual((itemPrice.match(numberPattern))[0]);
        await ExpectOpenBasket({ pageManager, baseURL });
    });

    test("TC04. Open a basket with 9 different products. Basket page opened and URL have /basket.", async ({ page, baseURL }) => {
        // Issue #02. After adding discount item basket icon in header disappears 
        const pageManager = new PageManager(page);
        const itemID = 1;
        const item = pageManager.basketPage.Elements.NonDiscountItem;
        let itemNames: string[] = new Array();
        let basketItemNames: string[] = new Array();
        let itemPrice = await (pageManager.basketPage.Elements.ItemPrice(item.nth(0))).textContent();
        let itemName = "";
        let sum = parseInt((itemPrice.match(numberPattern))[0], 10);
        await pageManager.basketPage.AddItemToBasket(item, itemID, itemID, 0);

        for (let i = 0; i < 8; i++) {
            await pageManager.basketPage.AddItemToBasket(pageManager.basketPage.Containers.ItemsContainer, itemID, 2 + i, i);
            itemName = await (pageManager.basketPage.Elements.ItemName(pageManager.basketPage.Containers.ItemsContainer.nth(i))).textContent();
            itemPrice = await (pageManager.basketPage.Elements.ItemPrice(pageManager.basketPage.Containers.ItemsContainer.nth(i))).textContent();
            sum = parseInt((itemPrice.match(numberPattern))[0], 10) + sum;
            itemNames.push(itemName);
        };

        await pageManager.basketPage.ClickOnBasketIcon();

        for (let i = 0; i < 8; i++) {
            basketItemNames.push(await pageManager.basketPage.DropdownElements.BasketItemName.nth(i).textContent());
        };

        const basketPrice = await pageManager.basketPage.DropdownElements.BasketPrice.textContent();
        await expect(parseInt((basketPrice.match(numberPattern))[0], 10)).toEqual(sum);
        await expect(basketItemNames.sort()).toStrictEqual(itemNames.sort());
        await ExpectOpenBasket({ pageManager, baseURL });
    });

    test("TC05. Open a basket with 9 sale items of the same name. Basket page opened and URL have /basket.", async ({ page, baseURL }) => {
        // Issue #02. After adding discount item basket icon in header disappears 
        const pageManager = new PageManager(page);
        const item = pageManager.basketPage.Elements.DiscountItem;
        const itemID = 0;
        const numberOfItemsToBasket = 9;
        const itemName = await (pageManager.basketPage.Elements.ItemName(item.nth(itemID))).textContent();
        const itemPrice = await (pageManager.basketPage.Elements.ItemPrice(item.nth(itemID))).textContent();
        await pageManager.basketPage.AddItemToBasket(item, numberOfItemsToBasket, numberOfItemsToBasket, itemID);
        await pageManager.basketPage.ClickOnBasketIcon();
        const basketPrice = await pageManager.basketPage.DropdownElements.BasketPrice.textContent();
        await expect(parseInt((basketPrice.match(numberPattern))[0], 10)).toEqual(parseInt((itemPrice.match(numberPattern))[0], 10) * numberOfItemsToBasket);
        await expect(await pageManager.basketPage.DropdownElements.BasketItemName.textContent()).toEqual(itemName);
        await ExpectOpenBasket({ pageManager, baseURL });

    });

    async function ExpectOpenBasket({ pageManager, baseURL }) {
        await pageManager.basketPage.Buttons.OpenBasketButton.click();
        await expect(pageManager.page, 'Basket page opened and URL have /basket').toHaveURL(`${baseURL}/basket`);
    };

    async function CleanBasket(page) {
        const pageManager = new PageManager(page);
        await pageManager.basketPage.Elements.Counter.waitFor();
        const counterValue = await pageManager.basketPage.Elements.Counter.textContent();
        //Issue #03. After adding 9 elements to basket, and click on basket icon dropodrown doesn't appear and it redirects to basket page. 
        if (counterValue === "9") {
            await pageManager.basketPage.AddItemToBasket(pageManager.basketPage.Containers.ItemsContainer, 1, 10, 5);
            await pageManager.basketPage.OpenBasketDropdownAndClean();
            await expect(await pageManager.basketPage.Elements.Counter).toHaveText("0");
        } else if (counterValue !== "0") {
            await pageManager.basketPage.OpenBasketDropdownAndClean();
            await expect(await pageManager.basketPage.Elements.Counter).toHaveText("0");
        };
    };
});
