import { Client, gql } from "@urql/core";
import { performUrqlOperation } from "../performUrqlOperation";


type QueuedMessage = {
    receiptHandle: string;
    body: any;
    metadata: {
        id: string;
        time: string;
        type: string;
    };
};

type QueuedMessagesResponse = {
    queuedMessages: {
        messages: QueuedMessage[];
    };
};

export const getQueuedMessages = async (client: Client) => {
    return await performUrqlOperation(
        client.query<QueuedMessagesResponse>(query, {
            input: {
                maxMessages: 10,
                visibilityTimeout: 5, // Passing 0 seems to get defaulted to a very long timeout.
                waitTime: 0,
            },
        })
    );
};

const query = gql`
    query QueuedMessages($input: QueuedMessagesInput!) {
        queuedMessages(input: $input) {
            messages {
                receiptHandle
                body
                metadata {
                    id
                    time
                    type
                }
            }
        }
    }
`;
