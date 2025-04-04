import { Page } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        await this.page.goto(url);
    }

    async clickElement(locator: string) {
        await this.page.locator(locator).click();
    }

    async fillInput(locator: string, value: string) {
        await this.page.locator(locator).fill(value);
    }

    async selectDropdown(locator: string, value: string) {
        await this.page.locator(locator).selectOption(value);
    }

    async clickButton(buttonName: string) {
        await this.page.getByRole('button', { name: buttonName }).first().click();
    }

}