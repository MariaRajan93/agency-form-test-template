import { config } from "../../config";

export const getTestUsers = (isAssistedForms = false) => {
    const userIds = isAssistedForms ? config.AF_E2E_TEST_USER_IDS : config.E2E_TEST_USER_IDS;
    return userIds ? userIds.split(" ") : [];
};
