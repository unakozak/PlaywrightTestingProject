import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage/LoginPage';
import { BasketPage } from './BasketPage/BasketPage';

export class PageManager {
    page: Page;
    loginPage;
    basketPage;

    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.basketPage = new BasketPage(page);
    };
};
