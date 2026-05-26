import { PlaywrightTestConfig } from "@playwright/test";
import { config } from "./config";
import { getTestUsers } from "./src/utils";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const baseConfig: PlaywrightTestConfig = {
    globalSetup: require.resolve("./globalSetup.ts"),
    testDir: "./src/tests",
    /* Maximum time one test can run for. */
    timeout: 180_000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: process.env.CI ? 15000 : 5000,
    },
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    retries: 2,
    /* Parallel tests on CI and local are limited by the number of provided test users.
     * In local ideally should be 1 due to multiple devs potentially running E2E tests concurrently */
    workers: getTestUsers().length ?? 0,
    /* Fully-parallel mode */
    fullyParallel: true,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? [["html", { outputFolder: "test-results", open: "never" }]] : "list",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: `${config.DTP_ROOT_URL}`,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
        locale: "en-AU",
        timezoneId: "Australia/Brisbane",
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "chromium",
            use: {
                defaultBrowserType: "chromium",
                viewport: {
                    height: 1080,
                    width: 1920,
                },
            },
        },
    ],
};

export default baseConfig;
