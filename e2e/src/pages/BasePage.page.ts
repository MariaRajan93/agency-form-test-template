import { Locator, Page } from "@playwright/test";

export class BasePage {
    readonly continueButton: Locator;
    readonly submitButton: Locator;
    readonly backButton: Locator;
    readonly page: Page;
    readonly controlBar: Locator;
    readonly beginBar: Locator;
    readonly logoutButton: Locator;
    readonly mobileMenu: Locator;
    readonly mobileLogoutButton: Locator;
    readonly unsavedChangesModal: Locator;
    readonly unsavedChangesModalReturn: Locator;
    readonly unsavedChangesModalExit: Locator;
    readonly downloadPdfButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.continueButton = page.getByRole("button", {
            name: "Save and continue",
        });
        this.submitButton = page.getByRole("button", { name: "Submit" });
        this.backButton = page.getByRole("button", { name: /^Back$/ });
        this.controlBar = page.locator("#control-bar");
        this.beginBar = page.locator("#begin-bar");
        this.logoutButton = page.locator('header[role="banner"] button:has-text("Logout")');
        this.mobileMenu = page.getByRole("button", { name: "Menu Menu" });
        this.mobileLogoutButton = page.locator("#mobile-menu button:has-text('Logout')");
        this.unsavedChangesModal = page.getByTestId("dtf-modal").getByText("You have unsaved changes");
        this.unsavedChangesModalReturn = page.getByTestId("dtf-modal").getByText("Return to form");
        this.unsavedChangesModalExit = page.getByTestId("dtf-modal").getByRole("button").getByText("Leave now");
        this.downloadPdfButton = page.getByTestId("download-pdf");
    }

    async getPage() {
        return this.page;
    }

    async back() {
        await this.backButton.click();
    }
}
