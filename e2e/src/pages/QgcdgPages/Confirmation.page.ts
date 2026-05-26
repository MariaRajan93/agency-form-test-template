import { expect, Locator, Page } from "@playwright/test";
import * as fs from "fs";

export class ConfirmationPage {
    readonly page: Page;
    readonly pageTitle: Locator;
    readonly inPageAlert: Locator;
    readonly nextStep: Locator;
    readonly withdrawApplication: Locator;
    readonly moreInformation: Locator;
    readonly referenceNumber: Locator;
    readonly downloadPdfButton: Locator;
    readonly inPageAlertHeader: Locator;
    readonly afDownloadPdfButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.getByRole("heading", { name: "Form submitted" });
        this.inPageAlertHeader = page.getByRole("heading", { name: "This form was successfully submitted" });
        this.inPageAlert = page.locator("dtf-inpage-alert");
        this.nextStep = page.getByRole("heading", { name: "What happens next?" });
        this.withdrawApplication = page.getByRole("heading", { name: "Withdraw your application" });
        this.moreInformation = page.getByRole("heading", { name: "Need more information" });
        this.referenceNumber = page.getByTestId("reference-number");
        this.downloadPdfButton = page.getByRole("button", { name: /^Download a copy of your completed form/ });
        this.afDownloadPdfButton = page.getByRole("button", { name: /^Download a copy of the completed form/ });
    }

    async wasSuccessful() {
        await expect(this.pageTitle).toBeVisible();
    }

    async downloadAndVerifyPdf(formTitle: string | undefined, referenceNumPrefix: string, isAssistedForms = false) {
        if (isAssistedForms) {
            await expect(this.afDownloadPdfButton).toBeVisible();
        } else {
            await expect(this.downloadPdfButton).toBeVisible();
        }

        const [download] = await Promise.all([
            this.page.waitForEvent("download"),
            (isAssistedForms ? this.afDownloadPdfButton : this.downloadPdfButton).click(),
        ]);

        // Wait for the download process to complete
        const pdfDownloadPath = await download.path();
        expect(pdfDownloadPath).not.toBeNull();
        const reg = new RegExp(`^Reference ${referenceNumPrefix}-.{5}-.{5}_${formTitle}\\.pdf$`);
        // Check that the content disposition header was set correctly
        expect(download.suggestedFilename()).toMatch(reg);

        if (pdfDownloadPath !== null) {
            fs.open(pdfDownloadPath, "r", (err, fd) => {
                expect(err).toBeNull();

                // Confirming that first 5 bytes of the file are the PDF file signature
                // as per https://en.wikipedia.org/wiki/List_of_file_signatures
                const buffer = Buffer.alloc(5);
                fs.read(fd, buffer, 0, 5, 0, (err, num) => {
                    expect(buffer.toString("hex", 0, num)).toBe("255044462d");
                });
            });
        }
    }
}
