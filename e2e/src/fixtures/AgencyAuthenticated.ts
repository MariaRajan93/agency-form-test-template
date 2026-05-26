import { config } from "../../config";

export const getSubscriberToken = async () => {
    try {
        const response = await fetch(
            `https://www.${config.E2E_TEST_RUNNER_ENV}.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${btoa(
                        config.E2E_SUBSCRIBER_CLIENT_ID + ":" + config.E2E_SUBSCRIBER_CLIENT_SECRET
                    )}`,
                },
                body: "grant_type=client_credentials",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch token");
        }

        const data = (await response.json()) as { access_token: string };

        return data.access_token;
    } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
    }
};
