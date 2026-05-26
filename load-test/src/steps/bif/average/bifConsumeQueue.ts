import { check } from "k6";
import { getQueuedMessages, Message } from "../../../api/agency/getQueuedMessages.ts";
import {
    bifAgencyPDFGenerationDurationTrend,
    bifCustomerPDFGenerationDurationTrend,
    bifGetPresignedUrlDurationTrend,
    bifGetPresignedUrlFailureCounter,
    bifGetPresignedUrlSuccessCounter,
    bifMessagesPerIterationCounter,
    bifSubmissionsProcessingEndCounter,
    bifSubmissionsProcessingStartCounter,
} from "../../../metrics.ts";
import { getPdfAsAgency } from "../../../api/agency/getPdfAsAgency.ts";
import { getPresignedUrls } from "../../../api/agency/getPresignedUrls.ts";
import { processStatusChange, statusChangeEvents } from "./processStatusChange.ts";
import { deleteQueuedMessage } from "../../../api/agency/deleteQueuedMessage.ts";
import { generateReferenceNum, processTrackedRequest } from "./processTrackedRequest.ts";

export const bifConsumeQueue = async ({ accessToken }: { accessToken: string }) => {
    // Consume messages from the queue until queue size is reached
    const { messages } = await getQueuedMessages({ accessToken: accessToken });
    console.log(`Received ${messages.length} messages from the queue.`);
    bifMessagesPerIterationCounter.add(messages.length);
    // deleting messages straight away so it won't block other users to get next batch of messages
    for (const message of messages) {
        const response = await deleteQueuedMessage({
            accessToken,
            receiptHandle: message.receiptHandle,
        });
        check(response.deleteQueuedMessage, { "Delete Queued Message": (r) => r });
    }
    // now process the current in memory messages
    await Promise.all(messages.map((message) => processMessage({ accessToken, message })));
};

const processMessage = async ({ accessToken, message }: { accessToken: string; message: Message }) => {
    bifSubmissionsProcessingStartCounter.add(1);
    const startAgencyPdfTrend = Date.now();
    const agentPdf = await getPdfAsAgency({
        accessToken,
        subjectId: message.body.input.customerID,
        transactionId: message.body.input.transactionID,
        requestId: message.body.input.requestID,
        mode: "agency",
    });
    const endAgencyPdfTrend = Date.now();
    bifAgencyPDFGenerationDurationTrend.add(endAgencyPdfTrend - startAgencyPdfTrend);
    check(agentPdf, { "BIF - Agent pdf is loaded": Boolean });

    const startCustomerPdfTrend = Date.now();
    const customerPdf = await getPdfAsAgency({
        accessToken,
        subjectId: message.body.input.customerID,
        transactionId: message.body.input.transactionID,
        requestId: message.body.input.requestID,
        mode: "customer",
    });
    const endCustomerPdfTrend = Date.now();
    bifCustomerPDFGenerationDurationTrend.add(endCustomerPdfTrend - startCustomerPdfTrend);
    check(customerPdf, { "Customer pdf is loaded": Boolean });

    const startPreSignedTrend = Date.now();
    const attachments = await getPresignedUrls({
        accessToken,
        subjectId: message.body.input.customerID,
        transactionId: message.body.input.transactionID,
        requestId: message.body.input.requestID,
    });
    const endPreSignedTrend = Date.now();
    bifGetPresignedUrlDurationTrend.add(endPreSignedTrend - startPreSignedTrend);
    check(attachments, { "BIF - Presigned urls are loaded": (r) => r.length > 0 });

    if (attachments.length > 0) {
        bifGetPresignedUrlSuccessCounter.add(1);
    } else {
        bifGetPresignedUrlFailureCounter.add(1);
        console.error("No attachments found for requestId: " + message.body.input.requestID);
    }

    // Randomly select status to update
    const randomIndex = Math.floor(Math.random() * statusChangeEvents.length);
    await processStatusChange({
        accessToken,
        message,
        ...statusChangeEvents[randomIndex],
    });

    // Add child tracked request 50% of the time
    if (Math.random() < 0.5) {
        // avoid to add child tracked request by 2 subscribers at the same time
        if (__VU % 2 === 0) {
            const childReferenceNum = generateReferenceNum();
            await processTrackedRequest({
                accessToken,
                customerId: message.body.input.customerID,
                serviceId: message.body.input.serviceID,
                serviceInteractionId: message.body.input.serviceInteractionID,
                input: {
                    contactDetails: {
                        email: "bifTest@example.com",
                    },
                    referenceNum: childReferenceNum,
                    subType: "BIF_CHILD",
                    parentReferenceNum: message.body.input.referenceNum,
                    serviceInteractionName: "Service Tracking Test",
                    status: "SUBMITTED",
                    summary: {},
                },
            });
        }
    }

    bifSubmissionsProcessingEndCounter.add(1);
};
