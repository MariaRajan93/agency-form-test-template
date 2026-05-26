import { check, fail } from "k6";
import { createTrackedRequest } from "../../../api/createTrackedRequest.ts";
import {
    bifCreateChildTrackedRequestDurationTrend,
    bifCreateChildTrackedRequestSuccessCounter,
    bifCreateTrackedRequestDurationTrend,
    bifCreateTrackedRequestSuccessCounter,
} from "../../../metrics.ts";
import type { MyQldCreateTrackedRequestInput } from "../../../../../libs/types/gql.d.ts" 

/**
 * Type for a child tracked request (must have `parentReferenceNum` and `subType`).
 */
type ChildTrackedRequest = MyQldCreateTrackedRequestInput & {
    parentReferenceNum: Exclude<MyQldCreateTrackedRequestInput, undefined>;
    subType: Exclude<MyQldCreateTrackedRequestInput, undefined>;
};

function isChildRequest(input: MyQldCreateTrackedRequestInput): input is ChildTrackedRequest {
    return "parentReferenceNum" in input && "subType" in input;
}

export const processTrackedRequest = async (props: {
    accessToken: string;
    customerId: string;
    serviceId: string;
    serviceInteractionId: string;
    input: MyQldCreateTrackedRequestInput;
}): Promise<void> => {
    const { accessToken, customerId, serviceId, serviceInteractionId, input } = props;
    const isChild = isChildRequest(input);
    const startCreateTrackedRequest = Date.now();

    const response = await createTrackedRequest({
        accessToken,
        customerId: customerId,
        serviceId: serviceId,
        serviceInteractionId: serviceInteractionId,
        input: {
            ...input,
            submittedDate: new Date().toISOString(),
        },
    });

    if (!check(response, { "BIF - Create tracked request successful": (r) => r === input.referenceNum })) {
        fail("BIF - Create tracked request failed");
    }

    if (isChild) {
        bifCreateChildTrackedRequestSuccessCounter.add(1);
        bifCreateChildTrackedRequestDurationTrend.add(Date.now() - startCreateTrackedRequest);
    } else {
        bifCreateTrackedRequestSuccessCounter.add(1);
        bifCreateTrackedRequestDurationTrend.add(Date.now() - startCreateTrackedRequest);
    }
};

/**
 * Generate random reference number for child tracked requests
 * @returns BIF-XXXXX-XXXXX
 */
export const generateReferenceNum = () => {
    const prefix = "BIF";
    const randomSegment = () => Math.random().toString(36).substring(2, 7).toUpperCase(); // 5 characters
    return `${prefix}-${randomSegment()}-${randomSegment()}`; // PREFIX-XXXXX-XXXXX
};
