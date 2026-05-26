import { Client, gql } from "@urql/core";
import { performUrqlOperation } from "../performUrqlOperation";

export const subscribe = async (client: Client, txnIds: string[]) => {
    return await performUrqlOperation(
        client.mutation(query, {
            input: {
                mode: "PULL",
                subscriptionSource: {
                    eventType: "myQLDServiceRequestSubscribe",
                    subscribeAll: false,
                    pairwiseTranslation: false,
                    recordIds: txnIds,
                },
            },
        })
    );
};

const query = gql`
    mutation MyQLDServiceRequestSubscribe($input: SubscriptionInput!) {
        myQLDServiceRequestSubscribe(input: $input) {
            success
        }
    }
`;
