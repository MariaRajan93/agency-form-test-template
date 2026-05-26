import exec from "k6/execution";
import { config } from "../../config/config.ts";

export const getTestSubscriberClientIds = () => {
    return config.LOAD_TEST_SUBSCRIBER_CLIENT_IDS.split(",");
};

export const getIterationBasedSubscriberClientId = () => {
    const clientIds = getTestSubscriberClientIds();
    //use % operator to alternate between the two available client IDs.
    const userIndex = exec.vu.idInTest % clientIds.length;

    return clientIds[userIndex];
};

export const getTestSubscriberClientSecrets = () => {
    return config.LOAD_TEST_SUBSCRIBER_CLIENT_SECRETS.split(",");
};

export const getIterationBasedSubscriberClientSecret = () => {
    const clientSecrets = getTestSubscriberClientSecrets();
    //use % operator to alternate between the two available client Secrets.
    const userIndex = exec.vu.idInTest % clientSecrets.length;

    return clientSecrets[userIndex];
};
