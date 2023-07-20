import { test, expect } from '@playwright/test';
import * as userData from '../../TestsData/TestData.json';
import { PageManager } from '../../ApplicationLogic/Pages/PageManager';

test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    const pageManager = new PageManager(page);
    await pageManager.loginPage.Login(userData.users.UserOne.login, userData.users.UserOne.password);
    await pageManager.basketPage.CleanBasket();
});

test.afterEach(async ({ page }) => {
    page.close();
});

test.describe('Basket Tests', async () => {
    test("TC01. Open an empty shopping basket. Basket page opened and URL have /basket", async ({ page, baseURL }) => {
        // test.fail(true, 'Issue #01. When basket is empty, dropdown don`t appear');
        const pageManager = new PageManager(page);
        await pageManager.basketPage.ClickOnBasketIcon();
        await pageManager.basketPage.OpenBasket();
        await expect(page, 'Basket page opened and URL have /basket').toHaveURL(`${baseURL}/basket`);
    });

    test("TC02. Open a basket with 1 non-sale item. Basket page opened and URL have /basket", async ({ page, baseURL }) => {
        const pageManager = new PageManager(page);
        await pageManager.basketPage.AddItemToBasket(pageManager.basketPage.Buttons.BuyItem(pageManager.basketPage.Elements.NonDiscountItem), 1, 1);
        await expect(pageManager.basketPage.Elements.Counter, 'The number 1 is displayed in icon next to the shopping cart').toHaveText('1');
        await OpenBasketWithItem({ page, baseURL });
    });

    test("TC03. Open a basket with 1 sale item. Basket page opened and URL have /basket.", async ({ page, baseURL }) => {
        // test.fail(true, 'Issue #02. After adding discount item basket icon in header disappears'); 
        const pageManager = new PageManager(page);
        await pageManager.basketPage.AddItemToBasket(pageManager.basketPage.Buttons.BuyItem(pageManager.basketPage.Elements.DiscountItem), 1, 1);
        await expect(pageManager.basketPage.Elements.Counter, 'The number 1 is displayed in icon next to the shopping cart').toHaveText('1');
        await OpenBasketWithItem({ page, baseURL });
    });

    test("TC04. Open a basket with 9 different products. Basket page opened and URL have /basket.", async ({ page, baseURL }) => {
        // test.fail(true, 'Issue #02. After adding discount item basket icon in header disappears'); 
        const pageManager = new PageManager(page);
        await pageManager.basketPage.AddItemToBasket(pageManager.basketPage.Buttons.BuyItem(pageManager.basketPage.Elements.NonDiscountItem), 1, 1, 0);
        for (let i = 0; i < 8; i++) {
            await pageManager.basketPage.AddItemToBasket(pageManager.basketPage.Buttons.BuyItem(pageManager.basketPage.Containers.ItemsContainer), 1, 2 + i, i);
        };
        await expect(pageManager.basketPage.Elements.Counter, 'The number 9 is displayed in icon next to the shopping cart').toHaveText('9');
        await OpenBasketWithItem({ page, baseURL });
    });

    test("TC05. Open a basket with 9 sale items of the same name. Basket page opened and URL have /basket.", async ({ page, baseURL }) => {
        // test.fail(true, 'Issue #02. After adding discount item basket icon in header disappears'); 
        const pageManager = new PageManager(page);
        await pageManager.basketPage.AddItemToBasket(pageManager.basketPage.Buttons.BuyItem(pageManager.basketPage.Containers.ItemsContainer), 9, 9, 0);
        await expect(pageManager.basketPage.Elements.Counter, 'The number 9 is displayed in icon next to the shopping cart').toHaveText('9');
        await OpenBasketWithItem({ page, baseURL });
    });

    async function OpenBasketWithItem({ page, baseURL }) {
        const pageManager = new PageManager(page);
        await pageManager.basketPage.ClickOnBasketIcon();
        await expect(pageManager.basketPage.DropdownElements.DropdownBasket, 'Dropdown of basket is visible').toBeVisible();
        await expect(pageManager.basketPage.DropdownElements.BasketItemPrice, 'Price of item is visible').toBeVisible();
        await expect(pageManager.basketPage.DropdownElements.BasketItemTitle, 'Item title is visible').toBeVisible();
        await expect(pageManager.basketPage.DropdownElements.BasketPrice, 'Total price of basket is visible').toBeVisible();
        await pageManager.basketPage.OpenBasket();
        await expect(page, 'Basket page opened and URL have /basket').toHaveURL(`${baseURL}/basket`);
    };
});
