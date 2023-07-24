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
        BasketLink: this.Containers.HeaderContainer.locator('#dropdownBasket'),
        BasketIcon: this.Containers.HeaderContainer.locator('[class*= "basket_icon"]'),
        Counter: this.Containers.HeaderContainer.locator('.basket-count-items'),
        DiscountItem: this.page.locator('.hasDiscount'),
        NonDiscountItem: this.page.locator('.note-item:not(.hasDiscount)'),
        ItemName: (container) => container.locator('.product_name'),
        ItemPrice: (container) => container.locator('.product_price'),
    };

    DropdownElements = {
        DropdownBasket: this.page.locator('[aria-labelledby="dropdownBasket"]'),
        BasketItemName: this.page.locator('.basket-item-title'),
        BasketItemPrice: this.page.locator('.basket-item-price'),
        BasketPrice: this.page.locator('.basket_price'),
    };

    Buttons = {
        OpenBasketButton: this.DropdownElements.DropdownBasket.locator(".btn-primary"),
        CleanBasket: this.DropdownElements.DropdownBasket.locator(".btn-danger"),
        BuyItemButton: (container) => container.locator('[class*="actionBuyProduct"]'),
    };

    TextBox = {
        ItemsBuyCount: (container) => container.locator('.form-control'),
    };

    async ClickOnBasketIcon() {
        await this.Elements.BasketIcon.click();
        await this.DropdownElements.DropdownBasket.waitFor();
    };

    async ClickOnBasketLink() {
        await this.Elements.BasketLink.click();
        await this.DropdownElements.DropdownBasket.waitFor();
    };

    async OpenBasketDropdownAndClean() {
        await this.Elements.BasketIcon.click();
        await this.Buttons.CleanBasket.click();
        await this.page.waitForSelector(`${this.Elements.Counter.toString().replace(/Locator@/g, '')}:has-text("0")`);
    };

    async AddItemToBasket(item, incrementNumber: number, targetItemsCount: number, itemIndex = 1) {
        await this.TextBox.ItemsBuyCount(item.nth(itemIndex)).waitFor();
        await this.TextBox.ItemsBuyCount(item.nth(itemIndex)).fill(`${incrementNumber}`);
        await this.Buttons.BuyItemButton(item.nth(itemIndex)).click();
        await this.page.waitForSelector(`${this.Elements.Counter.toString().replace(/Locator@/g, '')}:has-text("${targetItemsCount}")`);
    };
};