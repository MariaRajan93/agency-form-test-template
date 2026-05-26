import { expect, Locator, Page } from "@playwright/test";
import { AgencyFormPage, AgencyFormPageHeadings } from "../AgencyForm.page";

export class EligibilityPage extends AgencyFormPage {
    readonly conditionalPagesRadioGroup: Locator;

    constructor(page: Page) {
        super(page);
        this.conditionalPagesRadioGroup = page.getByRole("radiogroup");
    }

    async fillInEligibilityPage() {
        await expect(this.pageHeader).toHaveText(AgencyFormPageHeadings.ELIGIBILITY);
        await this.conditionalPagesRadioGroup.getByText("Yes").click();
    }
}
