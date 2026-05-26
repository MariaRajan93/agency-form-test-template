import { Client, gql } from "@urql/core";
import { performUrqlOperation } from "../performUrqlOperation";

export const deleteQueuedMessage = async (client: Client, receiptHandle: string) => {
    return await performUrqlOperation(
        client.mutation(query, { input: { receiptHandle } })
    );
};

const query = gql`
    mutation DeleteQueuedMessage($input: DeleteQueuedMessageInput!) {
        deleteQueuedMessage(input: $input)
    }
`;
