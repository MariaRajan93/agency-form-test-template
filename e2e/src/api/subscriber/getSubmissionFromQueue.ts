import { Client } from "@urql/core";
import { isBefore, subMilliseconds } from "date-fns";
import { expect } from "@playwright/test";
import { deleteQueuedMessage } from "./deleteQueuedMessage";
import { getQueuedMessages } from "./getQueuedMessages";

export const QUEUE_TIMEOUT = 180_000;

/**
 * Polls the event queue for a submission with the specified reference number.
 */
export const getSubmissionFromQueue = async (client: Client, referenceNum: string) => {
    return getSubmissionFromQueueWithIntervals(client, referenceNum, [2_000]);
};

export const getAttachmentSubmissionFromQueue = async (client: Client, referenceNum: string) => {
    // Form with attachments take longer to process due to file scanning.
    // Have longer initial interval to reduce interference with other tests polling the queue.
    return getSubmissionFromQueueWithIntervals(client, referenceNum, [30_000, 20_000, 15_000, 10_000, 5_000, 2_000]);
};

const getSubmissionFromQueueWithIntervals = async (client: Client, referenceNum: string, intervals: number[]) => {
    let submission;

    await expect(async () => {
        console.log(`Observing the queue for submission with reference number ${referenceNum}`);
        submission = await checkQueueForSubmission(client, referenceNum);
        expect(submission).toBeDefined();
    }).toPass({ intervals, timeout: QUEUE_TIMEOUT });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { submission: submission! };
};

const checkQueueForSubmission = async (client: Client, referenceNum: string) => {
    const { queuedMessages } = await getQueuedMessages(client);

    const messages = queuedMessages?.messages;
    if (!messages || messages.length === 0) {
        console.log("No messages found in the queue.", queuedMessages);
        return undefined;
    }

    // Passively clean up old messages that are still in the queue.
    await Promise.all(
        messages.map(async (message: any) => {
            try {
                if (isMessageOld(message)) {
                    console.log("Deleting old message from the queue", message);
                    await deleteQueuedMessage(client, message.receiptHandle);
                }
            } catch {
                // Swallow errors here. Don't really care if the message is not deleted.
            }
        })
    );

    const message = messages.find((queueMessage: any) => queueMessage.body.input.referenceNum === referenceNum);
    if (!message) {
        console.log(`No message found in the queue with reference number ${referenceNum}`);
        return undefined;
    }
    console.log(`Found message in the queue with reference number ${referenceNum}`);
    return message.body.input;
};

/**
 * Return whether message old enough to have been from a previous test.
 */
const isMessageOld = (message: any) => {
    const submittedDate = new Date(message.body.input.submittedDate);
    return isBefore(submittedDate, subMilliseconds(new Date(), QUEUE_TIMEOUT + 10_000));
};
