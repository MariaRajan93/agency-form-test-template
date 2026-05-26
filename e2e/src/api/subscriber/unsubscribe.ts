import { Client, gql } from "@urql/core";
import { performUrqlOperation } from "../performUrqlOperation";

export const unsubscribe = async (client: Client, subscriptionId: string) => {
    return await performUrqlOperation(
        client.mutation(query, { input: { systemSubscriptionIds: [subscriptionId] } })
    );
};

const query = gql`
    mutation Unsubscribe($input: UnsubscribeInput!) {
        unsubscribe(input: $input)
    }
`;
