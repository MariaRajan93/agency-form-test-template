import { Page } from "playwright";
import { expect } from "@playwright/test";

export const getScreenWidth = ({ screenSize }: { screenSize: string }): number => {
    const screenWidths = [
        { name: "xxl", width: 1920 },
        { name: "lg", width: 992 },
        { name: "sm", width: 699 },
    ];

    const screen = screenWidths.find((screen) => screen.name === screenSize);
    if (!screen) throw new Error(`Screen size ${screenSize} not found`);
    return screen.width;
};

export const waitForNetworkComplete = async (page: Page, operationName: string) => {
    const response = await page.waitForResponse(
        (response) =>
            response.url().includes("graph.qld.gov.au/graphql") &&
            response.request().postDataJSON().operationName === operationName
    );
    const requestId = response.request().postDataJSON().variables.requestId;
    expect(
        response.ok(),
        `${operationName} returned for requestID: ${requestId} with status: ${response.status()}`
    ).toBeTruthy();
};
