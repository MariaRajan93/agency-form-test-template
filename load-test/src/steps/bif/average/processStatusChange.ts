import { addStatusChangeEvent } from "../../../api/addStatusChangeEvent.ts";
import { bifUpdateTrackedRequestDurationTrend, bifUpdateTrackedRequestSuccessCounter } from "../../../metrics.ts";
import { Message } from "../../../api/agency/getQueuedMessages.ts";
import { check } from "k6";
import type { MyQldTrackedRequestOutcome, InputMaybe } from "../../../../../libs/types/gql.d.ts" 

type ProcessStatusChangeProps = {
    accessToken: string;
    message: Message;
    replacedReferenceNum?: string;
    status?: string;
    addDaysToExpectedCompletion?: number;
    informationRequired?: boolean;
    outcome?: InputMaybe<MyQldTrackedRequestOutcome>;
};

// Status change events
const ACTION_REQUIRED = { informationRequired: true };
const APPROVED = { status: "OUTCOME", outcome: "APPROVED" };
const COMPLETED = { status: "COMPLETED" };
const DECLINED = { status: "OUTCOME", outcome: "DECLINED" };
const DELAYED = { addDaysToExpectedCompletion: 10 };
const PROCESSING = { status: "PROCESSING" };

export const statusChangeEvents = [ACTION_REQUIRED, APPROVED, COMPLETED, DECLINED, DELAYED, PROCESSING];

/**
 * Processes a status change event by calling the addStatusChangeEvent API.
 * Uses provided referenceNum if available, otherwise falls back to the message referenceNum.
 */
export const processStatusChange = async ({
    accessToken,
    message,
    replacedReferenceNum,
    status,
    outcome,
    informationRequired,
    addDaysToExpectedCompletion,
}: ProcessStatusChangeProps): Promise<void> => {
    // Determine reference number (either new or existing)
    const referenceNum = replacedReferenceNum ?? message.body.input.referenceNum;
    const extendCompletionDate = addDaysToExpectedCompletion ?? 0;
    const currentDate = new Date();
    const expectedCompletionDate = new Date();
    expectedCompletionDate.setDate(currentDate.getDate() + extendCompletionDate);
    const startUpdateTrackedRequest = Date.now();

    const statusChangeResponse = await addStatusChangeEvent({
        accessToken,
        customerId: message.body.input.customerID,
        serviceId: message.body.input.serviceID,
        serviceInteractionId: message.body.input.serviceInteractionID,
        referenceNum,
        input: {
            status,
            comment: `Updating status to ${status}`,
            changedDate: currentDate.toISOString(),
            expectedCompletionDate: expectedCompletionDate.toISOString(),
            informationRequired,
            outcome,
        },
    });

    bifUpdateTrackedRequestSuccessCounter.add(1);
    bifUpdateTrackedRequestDurationTrend.add(Date.now() - startUpdateTrackedRequest);

    check(statusChangeResponse, {
        "BIF - Status change update event successful": (r) => r === referenceNum,
    });
};
