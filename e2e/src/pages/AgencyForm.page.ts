import { expect, FileChooser, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage.page";
import { waitForNetworkComplete } from "../tests/test-utils";
import { config } from "../../config";

export enum AgencyFormPageHeadings {
    ELIGIBILITY = "Eligibility",
    TYPE_OF_APPLICATION = "Type of application",
    PERSONAL_DETAILS = "Personal details",
    CONTACT_DETAILS = "Contact details",
    NEW_COMPONENT_TESTING = "New component testing",
    REVIEW = "Review",
    CONSENT_AND_DECLARATION = "Consent & Declaration",
}

export class AgencyFormPage extends BasePage {
    readonly pageHeader: Locator;
    readonly pageHeaderMobile: Locator;
    readonly stepCount: Locator;
    readonly formTitle: Locator;
    readonly digitalIdentityFirstName: Locator;
    readonly digitalIdentitySurname: Locator;
    readonly digitalIdentityDOB: Locator;
    readonly requiredFieldMessageTop: Locator;
    readonly authenticatedServiceHomeBreadcrumb: Locator;
    readonly mobileAuthenticatedServiceHomeBreadcrumb: Locator;
    prefillPageNumber = 0;
    PAGE_URL = "";

    constructor(page: Page) {
        super(page);
        this.pageHeader = page.locator(".agency-form-title-container h1");
        this.pageHeaderMobile = page.locator(".agency-form-title-container-mobile h1");
        this.stepCount = page.locator("dtf-step-count");
        this.formTitle = page.locator(".form-title").locator("visible=true");
        this.digitalIdentityFirstName = page.getByRole("heading", {
            name: "Testfirstname Testmiddlename",
        });
        this.digitalIdentitySurname = page.getByRole("heading", {
            name: "Testlastname",
        });
        this.digitalIdentityDOB = page.getByRole("heading", { name: "25/12/1984" });

        this.requiredFieldMessageTop = page.getByTestId("required-message-top");
        this.authenticatedServiceHomeBreadcrumb = page
            .getByTestId("service-home-link-progress-indicator")
            .getByText("Service home");
        this.mobileAuthenticatedServiceHomeBreadcrumb = page
            .getByTestId("service-home-link-form-banner")
            .getByText("Service home");
    }

    async goToAgencyForm(pageUrl: string) {
        await this.page.goto(pageUrl, { waitUntil: "load" });
    }

    async uploadFile({
        fileComponentLabel = "File component (optional)",
        isNewFileComponent, // TODO: Remove this parameter once file component versions are consolidated
        verifyResponse = true,
        file,
        skipResponseWait = false,
        isAssistedForms = false,
    }: {
        fileComponentLabel?: string;
        isNewFileComponent?: boolean;
        verifyResponse?: boolean;
        file: Parameters<FileChooser["setFiles"]>[0];
        skipResponseWait?: boolean;
        isAssistedForms?: boolean; // If true, use AF create attachment policy
    }) {
        let uploadResponsePromise;
        if (verifyResponse) {
            uploadResponsePromise = this.page.waitForResponse(config.ATTACHMENT_S3_BUCKET_URL);
        }
        const fileChooserPromise = this.page.waitForEvent("filechooser");

        const fileComponentClassSelector = isNewFileComponent ? ".formio-component-filev2" : ".formio-component-file";
        const uploadButtonSelector = "browse files";
        const fileComponentLabelLocator = this.page.getByText(fileComponentLabel);
        const fileComponent = this.page
            .locator(fileComponentClassSelector, { has: fileComponentLabelLocator })
            .locator("dtf-file");

        await fileComponent.getByRole("button", { name: uploadButtonSelector }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(file);

        // If skipResponseWait is false, wait for the attachment policy response
        if (!skipResponseWait) {
            isAssistedForms
                ? await waitForNetworkComplete(this.page, "MyQLDAgentCreateAttachmentPolicy")
                : await waitForNetworkComplete(this.page, "MyQLDCreateAttachmentPolicy");
        }

        if (verifyResponse && uploadResponsePromise) {
            const uploadResponse = await uploadResponsePromise;
            expect(
                uploadResponse.ok(),
                `Upload for ${fileComponentLabel} returned response with status code: ${uploadResponse.status()}`
            ).toBeTruthy();
        }
    }

    getUploadedFile(filename: string) {
        const completeFile = this.page
            .getByTestId("uploaded-file__item")
            .filter({ has: this.page.getByRole("button").filter({ hasText: filename }) });

        const name = completeFile.getByRole("button").filter({ hasText: filename });
        const deleteAction = completeFile.getByRole("button", { name: /Delete/ });

        return { name, deleteAction };
    }

    async nextPage(pageHeading: string) {
        await expect(this.continueButton).toBeEnabled();
        await this.continueButton.click();
        await expect(this.pageHeader).toHaveText(pageHeading);
    }

    async submitForm() {
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();
    }
}
