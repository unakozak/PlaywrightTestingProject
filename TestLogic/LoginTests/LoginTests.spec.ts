import { test, expect } from '@playwright/test';
import { PageManager } from '../../ApplicationLogic/Pages/PageManager';
import * as userData from '../../TestsData/TestData.json';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});
test.afterEach(async ({ page }) => {
  page.close();
});

test.describe('Login Page', async () => {
  test("Success login. Home page should be visible", async ({ page, baseURL }) => {
    const pageManager = new PageManager(page);
    await pageManager.loginPage.Login(userData.users.UserOne.login, userData.users.UserOne.password)
    await expect(page).toHaveURL(`${baseURL}`);
    await expect(pageManager.homePage.Containers.MainContainer, 'Home page should be visible').toBeVisible();
  });
});
