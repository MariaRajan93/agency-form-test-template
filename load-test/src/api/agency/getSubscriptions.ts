import { performGapiOperation } from "../performGapiOperation.ts";

type Data = {
    subscriptions: {
        id: string;
        clientId: string;
        mode: string;
        subscriptionSource: {
            eventType: string;
            recordIds: string[];
            subscribeAll: boolean;
        };
    }[];
};

export const getSubscriptions = async ({ accessToken }: { accessToken: string }) => {
    return await performGapiOperation<Data>({
        accessToken,
        operationName: "Subscriptions",
        query,
    });
};

const query = `query Subscriptions {
  subscriptions {
    id
    clientId
    mode
    subscriptionSource {
      eventType
      recordIds
      subscribeAll
    }
  }
}`;
