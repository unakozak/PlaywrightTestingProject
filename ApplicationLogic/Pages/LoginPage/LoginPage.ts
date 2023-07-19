import { BasePage } from '../../BasePage';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
    };

    Containers = {
        MainContainer: this.page.locator('.site-login'),
    };

    TextBox = {
        Login: this.Containers.MainContainer.locator('#loginform-username'),
        Password: this.Containers.MainContainer.locator('#loginform-password'),
    };

    Buttons = {
        Login: this.Containers.MainContainer.locator('//*[@name="login-button"]'),
    };

    async Login(login, password) {
        await this.TextBox.Password.type(password);
        await this.TextBox.Login.type(login);
        await this.Buttons.Login.click();
    };
};