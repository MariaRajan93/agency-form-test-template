import { APIRequestContext, BrowserContext, test as base, request } from "@playwright/test";
import { jwtDecode } from "jwt-decode";
import { config } from "../../config";
import { getTestUsers } from "../utils";

type UserFixtures = {
    userAuthenticatedContext: BrowserContext;
};

const getUserAuthInfo = async (requestContext: APIRequestContext) => {
    const params = {
        headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
            Authorization:
                `Basic ` + btoa(`${config.E2E_TEST_RUNNER_CLIENT_ID}:${config.E2E_TEST_RUNNER_CLIENT_SECRET}`),
        },
        tags: {
            name: "IDB Exchange Client Credentials",
        },
    };
    const requestBody = {
        grant_type: "password",
        username: `test-runner-${config.AGENCY_NAME}_user-${process.env.USER_ID}`,
        password: config.E2E_TEST_RUNNER_PASSWORD,
        scope: "email openid profile",
    };

    return await requestContext
        .post(
            `https://www.${config.E2E_TEST_RUNNER_ENV}.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token`,
            {
                headers: params.headers,
                form: requestBody,
            }
        )
        .then((response) => {
            if (response.status() !== 200) {
                throw new Error(`Failed to obtain access token: ${response.status()} ${response.statusText()}`);
            }
            return response.json();
        });
};

const setCookies = async (context: BrowserContext, jsonResponse: any, url: string) => {
    const decoded = jwtDecode(jsonResponse.id_token);
    const userSessionID = (decoded as { sid: string }).sid;

    await context.addCookies([
        { name: "DTP_E2E_TESTING", value: "true", url },
        { name: "MYQLD_USE_TEST_AUTH", value: "false", url },
        {
            name: "DTP_E2E_ACC",
            value: jsonResponse.access_token,
            url,
        },
        {
            name: "DTP_E2E_ID",
            value: jsonResponse.id_token,
            url,
        },
        {
            name: "DTP_E2E_REF",
            value: jsonResponse.refresh_token,
            url,
        },
        {
            name: "DTP_E2E_SESSION_ID",
            value: userSessionID,
            url,
        },
    ]);
};

const setContext = async (context: BrowserContext) => {
    return await context.route(
        "https://www.*.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token",
        async (route) => {
            const cookies = await context.cookies();
            await route.fulfill({
                body: JSON.stringify({
                    access_token: cookies.find(({ name }) => name === "DTP_E2E_ACC")?.value,
                    expires_in: 1200,
                    refresh_expires_in: 1800,
                    refresh_token: cookies.find(({ name }) => name === "DTP_E2E_REF")?.value,
                    id_token: cookies.find(({ name }) => name === "DTP_E2E_ID")?.value,
                    token_type: "Bearer",
                    scope: "profile",
                }),
                headers: {
                    "content-type": "application/json",
                },
            });
        }
    );
};

const test = base.extend<UserFixtures>({
    userAuthenticatedContext: async ({ browser }, use) => {
        const workerIndex = parseInt(process.env.TEST_PARALLEL_INDEX || "0", 10);
        const userIds = getTestUsers();
        process.env.USER_ID = userIds[workerIndex % userIds.length];
        const url = config.DTP_ROOT_URL;
        const context = await browser.newContext();
        const requestContext = await request.newContext();

        const response = await getUserAuthInfo(requestContext);
        await setCookies(context, response, url);
        await requestContext.dispose();

        await setContext(context);
        await use(context);
    },
});

const testAssistedForms = base.extend<UserFixtures>({
    userAuthenticatedContext: async ({ browser }, use) => {
        const workerIndex = parseInt(process.env.TEST_PARALLEL_INDEX || "0", 10);
        const userIds = getTestUsers(true);
        process.env.USER_ID = userIds[workerIndex % userIds.length];
        const url = config.AF_ROOT_URL;
        const context = await browser.newContext();
        const requestContext = await request.newContext();

        const response = await getUserAuthInfo(requestContext);
        await setCookies(context, response, url);

        await requestContext.dispose();

        await setContext(context);
        await use(context);
    },
});

export { test, testAssistedForms };
