import { performGapiOperation } from "../performGapiOperation.ts";

type Response = {
    deleteQueuedMessage: boolean
}

export const deleteQueuedMessage = async ({
    accessToken,
    receiptHandle,
}: {
    accessToken: string;
    receiptHandle: string;
}) => {
    return await performGapiOperation<Response>({
        accessToken,
        operationName: "DeleteQueuedMessage",
        query: deleteQueuedMessageQuery,
        variables: { input: { receiptHandle } },
    });
};

const deleteQueuedMessageQuery = `mutation DeleteQueuedMessage($input: DeleteQueuedMessageInput!) {
  deleteQueuedMessage(input: $input)
}`;
