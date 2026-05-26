import { performGapiOperation } from "../performGapiOperation.ts";

export const unsubscribe = async ({
    accessToken,
    systemSubscriptionId,
}: {
    accessToken: string;
    systemSubscriptionId: string;
}) => {
    await performGapiOperation({
        accessToken,
        operationName: "Unsubscribe",
        query,
        variables: { input: { systemSubscriptionIds: [systemSubscriptionId] } },
    });
};

const query = `mutation Unsubscribe($input: UnsubscribeInput!) {
  unsubscribe(input: $input)
}`;
