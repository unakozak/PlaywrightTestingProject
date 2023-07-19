import { BasePage } from '../../BasePage';

export class HomePage extends BasePage {
    constructor(page) {
        super(page);
    };

    Containers = {
        MainContainer: this.page.locator('.site-index'),
    };
};