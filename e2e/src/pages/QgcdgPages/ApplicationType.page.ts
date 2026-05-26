import { expect, Locator, Page } from "@playwright/test";
import { AgencyFormPage } from "../AgencyForm.page";
type MedicareDetails = {
    name1: string;
    name2?: string;
    name3?: string;
    name4?: string;
    medicareNumber: string;
    medicareReference: string;
    medicareColour: "Green" | "Yellow" | "Blue";
    expiry: {
        day?: string;
        month: string;
        year: string;
    };
    dob?: {
        day: string;
        month: string;
        year: string;
    };
    reviewDetails: {
        medicareNumber: string;
        medicareReference: string;
        medicareName: string;
    };
};

type DriverLicenceDetails = {
    givenName: string;
    middleName?: string;
    familyName: string;
    licenceNumber: string;
    cardNumber: string;
    stateOfIssue: "QLD" | "NSW" | "VIC" | "SA" | "WA" | "TAS" | "NT" | "ACT";
    dateOfBirth: {
        day: string;
        month: string;
        year: string;
    };
    reviewDetails: {
        licenceNumber: string;
        stateOfIssue: string;
        name: string;
    };
};

const testDriverLicenceDetails: DriverLicenceDetails = {
    givenName: "Petra",
    middleName: "Jesse",
    familyName: "Fortycharacterssurnamemaximm",
    licenceNumber: "10002518",
    cardNumber: "B123456789",
    stateOfIssue: "QLD",
    dateOfBirth: {
        day: "24",
        month: "04",
        year: "1952",
    },
    reviewDetails: {
        licenceNumber: "100****8",
        stateOfIssue: "QLD",
        name: "Petra Jesse Fortycharacterssurnamemaximm",
    },
};

const testMedicareDetails: MedicareDetails = {
    name1: "De Bruin",
    medicareNumber: "3950822677",
    medicareReference: "1",
    medicareColour: "Yellow",
    expiry: {
        day: "03",
        month: "07",
        year: "2025",
    },
    dob: {
        day: "01",
        month: "01",
        year: "1990",
    },
    reviewDetails: {
        medicareNumber: "3950*****7",
        medicareReference: "1",
        medicareName: "De Bruin",
    },
};

export class ApplicationTypePage extends AgencyFormPage {
    readonly renewalRadioInput: Locator;
    readonly renewalRadio: Locator;
    readonly fileReferenceInput: Locator;

    // New file component
    readonly newFileComponentDropArea: Locator;

    // Medicare Component
    readonly testMedicareRadioGroup: Locator;
    readonly greenMedicareCardRadioCard: Locator;
    readonly yellowMedicareCardRadioCard: Locator;
    readonly blueMedicareCardRadioCard: Locator;
    readonly medicareCardNumberTextField: Locator;
    readonly medicareCardReferenceNumberTextField: Locator;
    readonly nameAppearsOnMultipleLinesRadioGroup: Locator;
    readonly medicareCardSingleNameTextField: Locator;
    readonly medicareCardName1TextField: Locator;
    readonly medicareCardName2TextField: Locator;
    readonly medicareCardName3TextField: Locator;
    readonly medicareCardName4TextField: Locator;
    readonly medicareCardExpiryDayInputField: Locator;
    readonly medicareCardExpiryMonthInputField: Locator;
    readonly medicareCardExpiryYearInputField: Locator;
    readonly medicareCardConsentCheckbox: Locator;
    readonly medicareCardVerifyButton: Locator;
    readonly medicareSuccessfullyVerifiedText: Locator;
    readonly medicareCardDobDay: Locator;
    readonly medicareCardDobMonth: Locator;
    readonly medicareCardDobYear: Locator;

    // Driver licence Component
    readonly testDriverLicenceRadioGroup: Locator;
    readonly driverLicenceStateOfIssueDropdown: Locator;
    readonly driverLicenceGivenNameTextField: Locator;
    readonly driverLicenceMiddleNameTextField: Locator;
    readonly driverLicenceFamilyNameTextField: Locator;
    readonly driverLicenceLicenceNumberTextField: Locator;
    readonly driverLicenceCardNumberTextField: Locator;
    readonly driverLicenceDateOfBirthDayInputField: Locator;
    readonly driverLicenceDateOfBirthMonthInputField: Locator;
    readonly driverLicenceDateOfBirthYearInputField: Locator;
    readonly driverLicenceConsentCheckbox: Locator;
    readonly driverLicenceVerifyButton: Locator;
    readonly driverLicenceSuccessfullyVerifiedText: Locator;

    // Bsb component
    readonly testBsbRadioGroup: Locator;
    readonly accountHolderNameTextField: Locator;
    readonly bsbInputField: Locator;
    readonly bsbBranchNameText: Locator;
    readonly bsbNotFoundError: Locator;
    readonly accountNumberError: Locator;
    readonly accountNumberInput: Locator;

    constructor(page: Page) {
        super(page);
        this.renewalRadioInput = page.locator(".qhealth__control-input", { hasText: /renewal/i });
        this.renewalRadio = page.getByRole("radio", { name: /renewal/i });
        this.fileReferenceInput = page.getByRole("textbox", { name: /file reference/i });
        this.newFileComponentDropArea = page.getByTestId("filev2").locator("#drop_area");

        // Medicare component
        this.greenMedicareCardRadioCard = page.getByText("Green");
        this.yellowMedicareCardRadioCard = page.getByText("Yellow");
        this.blueMedicareCardRadioCard = page.getByText("Blue");
        this.medicareCardNumberTextField = page.getByRole("textbox", { name: "Medicare card number" });
        this.medicareCardReferenceNumberTextField = page.getByRole("textbox", { name: "Individual reference number" });
        this.medicareCardSingleNameTextField = page.locator("input[name='nameSingleLine']");
        this.medicareCardName1TextField = page.locator("input[name='fullName1']");
        this.medicareCardName2TextField = page.locator("input[name='fullName2']");
        this.medicareCardName3TextField = page.locator("input[name='fullName3']");
        this.medicareCardName4TextField = page.locator("input[name='fullName4']");
        this.medicareCardExpiryDayInputField = page.getByRole("spinbutton", { name: "Expiry date day" });
        this.medicareCardExpiryMonthInputField = page.getByRole("spinbutton", { name: "Expiry date month" });
        this.medicareCardExpiryYearInputField = page.getByRole("spinbutton", { name: "Expiry date year" });
        this.nameAppearsOnMultipleLinesRadioGroup = page.getByRole("radiogroup", {
            name: /Does the name appear across more than one line of the card?/i,
        });
        this.medicareCardDobDay = page.locator("input[name='birth-date-day']");
        this.medicareCardDobMonth = page.locator("input[name='birth-date-month']");
        this.medicareCardDobYear = page.locator("input[name='birth-date-year']");
        this.medicareCardConsentCheckbox = page.getByRole("checkbox", {
            name: /I confirm that I am authorised to provide the personal details/i,
        });
        this.medicareCardVerifyButton = page.getByRole("button", { name: "Verify Medicare details" });
        this.medicareSuccessfullyVerifiedText = page.getByText("Medicare card status");
        this.testMedicareRadioGroup = page.getByRole("radiogroup", {
            name: "Do you want to test Medicare?",
        });

        // Driver licence component
        this.driverLicenceStateOfIssueDropdown = page.getByRole("combobox", { name: "State of issue" });
        this.driverLicenceGivenNameTextField = page.getByRole("textbox", { name: "Given name" });
        this.driverLicenceMiddleNameTextField = page.getByRole("textbox", { name: "Middle name" });
        this.driverLicenceFamilyNameTextField = page.getByRole("textbox", { name: "Family name" });
        this.driverLicenceLicenceNumberTextField = page.locator('input[name="licenceNumber"]');
        this.driverLicenceCardNumberTextField = page.locator('input[name="cardNumber"]');
        this.driverLicenceDateOfBirthDayInputField = page.getByRole("spinbutton", { name: "Date of birth day" });
        this.driverLicenceDateOfBirthMonthInputField = page.getByRole("spinbutton", { name: "Date of birth month" });
        this.driverLicenceDateOfBirthYearInputField = page.getByRole("spinbutton", { name: "Date of birth year" });
        this.driverLicenceConsentCheckbox = page.getByRole("checkbox", {
            name: /I confirm that I am authorised to provide the personal details/i,
        });
        this.driverLicenceVerifyButton = page.getByRole("button", { name: "Verify driver licence details" });
        this.driverLicenceSuccessfullyVerifiedText = page.getByText("Driver Licence status");
        this.testDriverLicenceRadioGroup = page.getByRole("radiogroup", {
            name: "Do you want to test the DVS Drivers Licence check?",
        });

        // BSB Component test form
        this.accountHolderNameTextField = page.getByTestId("account-name-input").getByRole("textbox");
        this.bsbInputField = page.getByTestId("bsb-input").getByRole("textbox");
        this.bsbBranchNameText = page.getByText("Commonwealth Bank of Australia, Sydney, NSW");
        this.bsbNotFoundError = page.getByText(
            "The BSB number you entered isn’t showing in our system. It's possible you may have typed it incorrectly, or we may be unable to verify it right now. Please check the number again to make sure it’s correct, and then you can continue."
        );
        this.accountNumberError = page.getByText(
            "Account number must contain only numbers. Please remove any letters or special characters"
        );
        this.accountNumberInput = page.getByTestId("account-number-input").getByRole("textbox");
        this.testBsbRadioGroup = page.getByRole("radiogroup", {
            name: "Do you want to test the bank account component?",
        });
    }

    async selectMedicareCard(cardType: "Green" | "Yellow" | "Blue") {
        switch (cardType) {
            case "Green":
                await this.greenMedicareCardRadioCard.click();
                break;
            case "Yellow":
                await this.yellowMedicareCardRadioCard.click();
                break;
            case "Blue":
                await this.blueMedicareCardRadioCard.click();
                break;
            default:
                throw new Error(`Invalid card type: ${cardType}`);
        }
    }

    async inputMedicareCardDetails(details: MedicareDetails) {
        await this.selectMedicareCard(details.medicareColour);
        await this.medicareCardNumberTextField.fill(details.medicareNumber.toString());
        await this.medicareCardReferenceNumberTextField.fill(details.medicareReference.toString());
        if (details.name2) {
            await this.nameAppearsOnMultipleLinesRadioGroup.getByText("Yes").click();
            await this.medicareCardName1TextField.fill(details.name1 ?? "");
            await this.medicareCardName2TextField.fill(details.name2 ?? "");
            await this.medicareCardName3TextField.fill(details.name3 ?? "");
            await this.medicareCardName4TextField.fill(details.name4 ?? "");
        } else {
            await this.nameAppearsOnMultipleLinesRadioGroup.getByText("No").click();
            await this.medicareCardSingleNameTextField.fill(details.name1 ?? "");
        }
        if (details.expiry.day) await this.medicareCardExpiryDayInputField.fill(details.expiry.day.toString());
        await this.medicareCardExpiryMonthInputField.fill(details.expiry.month.toString());
        await this.medicareCardExpiryYearInputField.fill(details.expiry.year.toString());
        if (details.dob) {
            const { day, month, year } = details.dob;
            await this.medicareCardDobDay.fill(day);
            await this.medicareCardDobMonth.fill(month);
            await this.medicareCardDobYear.fill(year);
        }
    }

    async selectStateOfIssue(state: "QLD" | "NSW" | "VIC" | "SA" | "WA" | "TAS" | "NT" | "ACT") {
        await this.page.selectOption('select[id$="dtfVerifyDriverLicence-state"]', state);
    }

    async inputDriverLicenceDetails(details: DriverLicenceDetails) {
        await this.selectStateOfIssue(details.stateOfIssue);
        await this.driverLicenceGivenNameTextField.fill(details.givenName);
        await this.driverLicenceMiddleNameTextField.fill(details.middleName ?? "");
        await this.driverLicenceFamilyNameTextField.fill(details.familyName);
        await this.driverLicenceLicenceNumberTextField.fill(details.licenceNumber);
        await this.driverLicenceCardNumberTextField.fill(details.cardNumber);
        await this.driverLicenceDateOfBirthDayInputField.fill(details.dateOfBirth.day);
        await this.driverLicenceDateOfBirthMonthInputField.fill(details.dateOfBirth.month);
        await this.driverLicenceDateOfBirthYearInputField.fill(details.dateOfBirth.year);
    }

    async verifyWithRetry(verifyButton: Locator, successAlert: Locator, maxRetries = 1, retryDelay = 60000) {
        await verifyButton.click();

        let attempts = 0;
        while (attempts < maxRetries) {
            try {
                await expect(successAlert).toBeVisible({ timeout: 30_000 });
                break;
            } catch (error) {
                if (attempts === maxRetries - 1) {
                    throw error;
                }
                await this.page.waitForTimeout(retryDelay);
                await verifyButton.click();
                attempts++;
            }
        }
    }

    async fillInDriverLicenceComponent() {
        await this.testDriverLicenceRadioGroup.getByText("yes").click();
        await this.inputDriverLicenceDetails(testDriverLicenceDetails);
        await this.driverLicenceConsentCheckbox.click();
        await this.verifyWithRetry(this.driverLicenceVerifyButton, this.driverLicenceSuccessfullyVerifiedText, 2);
    }

    async fillInMedicareComponent() {
        await this.testMedicareRadioGroup.getByText("yes").click();
        await this.inputMedicareCardDetails(testMedicareDetails);
        await this.medicareCardConsentCheckbox.click();
        await this.verifyWithRetry(this.medicareCardVerifyButton, this.medicareSuccessfullyVerifiedText, 2);
    }

    async fillInBsbComponent() {
        await this.testBsbRadioGroup.getByText("yes").click();
        await this.accountHolderNameTextField.fill("John Doe");

        await this.bsbInputField.fill("062692");
        await expect(this.bsbBranchNameText).toBeVisible();

        await this.accountNumberInput.fill("123456789");
    }

    async fillInApplicationTypePage(isAssistedForms = false) {
        await expect(this.renewalRadio).toBeChecked({
            checked: false,
        });

        await this.renewalRadioInput.locator("label").click();
        await expect(this.renewalRadio).toBeChecked();

        await expect(this.fileReferenceInput).toBeVisible();
        await this.fileReferenceInput.fill("12345");

        const newUploadFileComponentFileName = "new-upload-file-component.pdf";
        await this.uploadFile({
            fileComponentLabel: "Upload sensitive documents",
            file: {
                name: newUploadFileComponentFileName,
                mimeType: "application/pdf",
                buffer: Buffer.from("E2E test content"),
            },
            isNewFileComponent: true,
            isAssistedForms,
        });
        const { name: uploadedFileNameNew } = this.getUploadedFile(newUploadFileComponentFileName);
        await expect(uploadedFileNameNew).toBeVisible();

        await this.fillInBsbComponent();
        await this.fillInMedicareComponent();
        await this.fillInDriverLicenceComponent();
    }
}
