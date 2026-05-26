import { Locator } from "@playwright/test";
import { Page } from "playwright";

export class DraftModalSection {
    page: Page;
    readonly modal: Locator;
    readonly continueDraftButton: Locator;
    readonly startNewDraftButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.getByTestId("dtf-modal");
        this.continueDraftButton = this.modal.getByRole("button").filter({ hasText: /Continue to draft/ });
        this.startNewDraftButton = this.modal.getByRole("button").filter({ hasText: /Start new/ });
    }

    async startNewIfDraft({ continueOnError = true } = {}) {
        try {
            await this.startNewDraftButton.waitFor({ timeout: 10000 });
            const startNewQuestion = (await this.startNewDraftButton.count()) > 0;

            if (startNewQuestion) {
                await this.startNewDraftButton.click();
            }
        } catch (e) {
            if (!continueOnError) {
                throw e;
            }
        }
    }

    async continueIfDraft({ continueOnError = true } = {}) {
        try {
            await this.continueDraftButton.waitFor({ timeout: 10000 });
            const shouldContinueWithDraft = (await this.continueDraftButton.count()) > 0;

            if (shouldContinueWithDraft) {
                await this.continueDraftButton.click();
            }
        } catch (e) {
            if (!continueOnError) {
                throw e;
            }
        }
    }
}
