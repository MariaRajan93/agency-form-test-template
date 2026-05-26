import { expect, Locator, Page } from "@playwright/test";
import { AgencyFormPage } from "../AgencyForm.page";

export class PersonalDetailsPage extends AgencyFormPage {
    readonly selectTitleOption: Locator;
    readonly birthName: Locator;
    readonly checkOtherNamesRadio: Locator;
    readonly selectCountryOfBirthOption: Locator;
    readonly CityOfBirthTextField: Locator;
    readonly checkDriverLicenceRadio: Locator;
    readonly otherNameTextArea: Locator;
    readonly driverLicenceNumberTextField: Locator;
    readonly driverLicenceDateOfBirthDayInputField: Locator;
    readonly driverLicenceDateOfBirthMonthInputField: Locator;
    readonly driverLicenceDateOfBirthYearInputField: Locator;

    constructor(page: Page) {
        super(page);
        this.selectTitleOption = page.getByRole("combobox", { name: "Title" });
        this.birthName = page.getByLabel("Birth name");
        this.checkOtherNamesRadio = page.getByRole("radiogroup", {
            name: "Have you ever been known by any other name, including nicknames?",
        });
        this.selectCountryOfBirthOption = page.getByRole("combobox", {
            name: "Country of birth",
        });
        this.CityOfBirthTextField = page.getByLabel("City of birth");
        this.checkDriverLicenceRadio = page.getByRole("radiogroup", {
            name: "Do you have a current valid driver's licence?",
        });
        this.otherNameTextArea = page.locator('textarea[name="data[pleaseProvideYourOtherNameS]"]');
        this.driverLicenceNumberTextField = page.getByLabel("Drivers licence number");
        this.driverLicenceDateOfBirthDayInputField = page.locator("#dateOfExpiry-day");
        this.driverLicenceDateOfBirthMonthInputField = page.locator("#dateOfExpiry-month");
        this.driverLicenceDateOfBirthYearInputField = page.locator("#dateOfExpiry-year");
    }

    async selectTitle() {
        await this.selectTitleOption.selectOption({ index: 2 });
    }

    async typeBirthName() {
        await this.birthName.click();
        await this.birthName.fill("Mike");
    }

    async checkOtherNames(checkName: boolean) {
        const selectedRadioText = checkName ? "Yes" : "No";
        await expect(this.checkOtherNamesRadio.getByText(selectedRadioText)).not.toBeChecked();
        await this.checkOtherNamesRadio.getByText(selectedRadioText).check();
    }

    async selectPlaceOfBirth() {
        await this.selectCountryOfBirthOption.selectOption({ index: 1 });
        await this.CityOfBirthTextField.click();
        await this.CityOfBirthTextField.fill("Brisbane");
    }

    async checkDriverLicence(checkLicence: boolean) {
        const selectedRadioText = checkLicence ? "Yes" : "No";
        await expect(this.checkDriverLicenceRadio.getByText(selectedRadioText)).not.toBeChecked();
        return this.checkDriverLicenceRadio.getByText(selectedRadioText).check();
    }

    async fillInPersonalDetailsForm(isAssistedForms = false) {
        await this.selectTitle();
        // AF does not pre-fill
        if (isAssistedForms) {
            await this.typeBirthName();
        }
        await this.checkOtherNames(true);
        await this.otherNameTextArea.fill("Test e2e other name details");
        await this.selectPlaceOfBirth();
        await this.checkDriverLicence(true);
        await this.driverLicenceNumberTextField.fill("00000000000");
        await this.driverLicenceDateOfBirthDayInputField.fill("01");
        await this.driverLicenceDateOfBirthMonthInputField.fill("01");
        await this.driverLicenceDateOfBirthYearInputField.fill("2000");
    }
}
