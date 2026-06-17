interface K6Config {
    MYQLD_PORTAL_BASE_URL: string;
    DTP_DOMAIN: string;
    DTP_ROOT_URL: string;
    GAPI_URL: string;
    DTP_PDF_GENERATOR_URL: string;
    TC_SERVICE_URL: string;
    LOAD_TEST_RUNNER_CLIENT_ID: string;
    LOAD_TEST_SUBSCRIBER_CLIENT_IDS: string;
    LOAD_TEST_USER_IDS_DTP: string;
    LOAD_TEST_USER_IDS_PORTAL: string;
    LOAD_TEST_USER_IDS_AF: string;
    AF_DOMAIN: string;
    AF_ROOT_URL: string;
    TEST_RUNNER_ENV: string;
    LOAD_TEST_RUNNER_CLIENT_SECRET: string;
    LOAD_TEST_SUBSCRIBER_CLIENT_SECRETS: string;
    LOAD_TEST_USER_PASSWORD: string;
    AGENCY_NAME: string;
    DTP_VERSION_NUMBER: string;
    DTP_VERSION_SIGNATURE: string;
}

const env = __ENV.TEST_RUNNER_ENV || "syst";

// `open()` is called in the init context, so this runs once globally
const raw = open(`./k6config.${env}.json`);
const parsedConfig = JSON.parse(raw.toString()) as K6Config;

// inject sensitive env variables
parsedConfig.TEST_RUNNER_ENV = __ENV.TEST_RUNNER_ENV;
parsedConfig.LOAD_TEST_RUNNER_CLIENT_SECRET = __ENV.LOAD_TEST_RUNNER_CLIENT_SECRET;
parsedConfig.LOAD_TEST_SUBSCRIBER_CLIENT_SECRETS = __ENV.LOAD_TEST_SUBSCRIBER_CLIENT_SECRETS;
parsedConfig.LOAD_TEST_USER_PASSWORD = __ENV.LOAD_TEST_USER_PASSWORD;
parsedConfig.AGENCY_NAME = __ENV.AGENCY_NAME;
parsedConfig.DTP_VERSION_NUMBER = __ENV.DTP_VERSION_NUMBER;
parsedConfig.DTP_VERSION_SIGNATURE = __ENV.DTP_VERSION_SIGNATURE;

export const config: K6Config = parsedConfig;
