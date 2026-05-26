import { Client, gql } from "@urql/core";
import { performUrqlOperation } from "../performUrqlOperation";

export const getSubscriptions = async (client: Client) => {
    return await performUrqlOperation(client.query<{ subscriptions: Query["subscriptions"] }>(query, {}));
};

const query = gql`
    query Subscriptions {
        subscriptions {
            id
            clientId
            subscriptionSource {
                recordIds
                eventType
            }
        }
    }
`;
