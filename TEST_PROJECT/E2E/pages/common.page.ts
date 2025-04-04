import { STORAGE_STATE } from '../../../playwright.config';
import { BasePage } from './base.page';

export class Common extends BasePage {
    async reuseStorage() {
        await this.page.context().storageState({ path: STORAGE_STATE })
    }

}