import { type JSONObject } from "k6";
import { performGapiOperation } from "../performGapiOperation.ts";

type Data = {
    queuedMessages: {
        messages: Message[];
    };
};

export type Message = {
    receiptHandle: string;
    body: {
        input: {
            submittedDate: string;
            customerID: string;
            transactionID: string;
            formSubmission: FormSubmission;
            requestID: string;
            serviceID: string;
            serviceInteractionID: string;
            referenceNum: string;
        };
    };
    metadata: { id: string; time: number; type: string };
};

export type FormSubmission = {
    attachmentStatus: { avScanStatus: string; filename: string }[];
    evidence: JSONObject[];
    metadata: JSONObject;
    status: string;
    submissionData: JSONObject;
};

export const getQueuedMessages = async ({ accessToken }: { accessToken: string }) => {
    const data = await performGapiOperation<Data>({
        accessToken,
        operationName: "QueuedMessages",
        query: query,
        variables: { input: { maxMessages: 10, visibilityTimeout: 10, waitTime: 5 } }, // changed to 10 seconds to avoid the message being consumed by another process
    });
    return data.queuedMessages;
};

const query = `query QueuedMessages($input: QueuedMessagesInput!) {
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
}`;
