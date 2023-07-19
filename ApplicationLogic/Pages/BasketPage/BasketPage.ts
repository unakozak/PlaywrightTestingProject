import { BasePage } from "../../BasePage";

export class BasketPage extends BasePage {
    constructor(page) {
        super(page);
    };

    Containers = {
        MainContainer: this.page.locator('.site-index'),
        HeaderContainer: this.page.locator('#navbarNav'),
        BasketContainer: this.page.locator('#basketContainer'),
        ItemsContainer: this.page.locator('.note-item'),
    };

    Elements = {
        BasketIcon: this.Containers.HeaderContainer.locator('[class*= "basket_icon"]'),
        Counter: this.Containers.HeaderContainer.locator('.basket-count-items'),
        DiscountItem: this.page.locator('.hasDiscount'),
        NonDiscountItem: this.page.locator('.note-item:not(.hasDiscount)'),
    };

    DropdownElements = {
        DropdownBasket: this.page.locator('[aria-labelledby="dropdownBasket"]'),
        BasketItemTitle: this.page.locator('.basket-item-title'),
        BasketItemPrice: this.page.locator('.basket-item-price'),
        BasketPrice: this.page.locator('.basket_price'),
    };

    Buttons = {
        OpenBasketButton: this.DropdownElements.DropdownBasket.locator(".btn-primary"),
        CleanBasket: this.DropdownElements.DropdownBasket.locator(".btn-danger"),
        BuyItem: (container) => container.locator('[class*="actionBuyProduct"]'),
    };

    async OpenBasket() {
        await this.Buttons.OpenBasketButton.click();
    };

    async ClickOnBasketIcon() {
        await this.Elements.BasketIcon.click();
        await this.DropdownElements.DropdownBasket.waitFor()
    };

    async CleanBasket() {
        await this.Elements.Counter.waitFor();
        const counterValue = await this.Elements.Counter.textContent();
        if (counterValue === "9") {
            await this.AddItemToBasket(await this.Buttons.BuyItem(this.Elements.NonDiscountItem), 1, 10);
            await this.OpenBasketDropdownAndClean();
        } else if (counterValue !== "0") {
            await this.OpenBasketDropdownAndClean()
        };
    };

    async OpenBasketDropdownAndClean() {
        await this.Elements.BasketIcon.click();
        await this.Buttons.CleanBasket.click();
        await this.page.waitForSelector(`${this.Elements.Counter.toString().replace(/Locator@/g, '')}:has-text("0")`);
    };

    async AddItemToBasket(item, incrementNumber: number, targetItemsCount: number, itemIndex = 1) {
        for (let i = 0; i < incrementNumber; i++) {
            await item.nth(itemIndex).click();
        };
        await this.page.waitForSelector(`${this.Elements.Counter.toString().replace(/Locator@/g, '')}:has-text("${targetItemsCount}")`);
    };
};