import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage/LoginPage';
import { HomePage } from './HomePage/HomePage';
import { BasketPage } from './BasketPage/BasketPage';

export class PageManager {
    page: Page;
    loginPage;
    homePage;
    basketPage;

    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
        this.basketPage = new BasketPage(page);
    };
};
