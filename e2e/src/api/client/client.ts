import { Page } from "@playwright/test";
import { Client, fetchExchange } from "@urql/core";
import { config } from "../../../config";
import { getSubscriberToken } from "../../fixtures/AgencyAuthenticated";

export const createClient = ({ accessToken, gapiUrl }: { accessToken: string; gapiUrl: string }) =>
    new Client({
        url: gapiUrl,
        exchanges: [fetchExchange],
        fetchOptions: () => {
            return {
                headers: { authorization: `Bearer ${accessToken}` },
            };
        },
    });

export const getPageClient = async (page: Page) => {
    const cookies = await page.context().cookies();
    const token = cookies.find(({ name }) => name === "DTP_E2E_ACC")?.value;
    if (!token) {
        throw new Error("DTP_E2E_ACC cookie not found.");
    }
    return createClient({ accessToken: token, gapiUrl: config.E2E_DTP_GAPI_URL });
};

export const getSubscriberClient = async () => {
    const token = await getSubscriberToken();
    if (!token) {
        throw new Error("getSubscriberToken returned empty.");
    }
    return createClient({ accessToken: token, gapiUrl: config.E2E_DTP_GAPI_URL });
};
