import { createServiceRequest } from "../../api/user/createDraftServiceRequest.ts";
import { deleteServiceRequest } from "../../api/user/deleteDraftServiceRequest.ts";
import { getServiceRequest } from "../../api/user/getDraftServiceRequest.ts";
import { getAllServiceRequests, getServiceRequests } from "../../api/user/getDraftServiceRequests.ts";
import { config } from "../../../config/config.ts";
import type { TransactionConfigurationResponseDto } from "../../../../libs/types/transactionConfiguration.d.ts"

type Props = {
    accessToken: string;
    transactionConfig: TransactionConfigurationResponseDto;
};

export const createNewDraft = async ({ accessToken, transactionConfig }: Props) => {
    const transactionId = transactionConfig.transactionId;
    const metadata = {
        dtpVersionNumber: config.DTP_VERSION_NUMBER,
        dtpVersionSignature: config.DTP_VERSION_SIGNATURE,
        formId: transactionConfig.formId,
        formTitle: transactionConfig.formTitle,
        projectId: transactionConfig.projectId,
        revisionNo: transactionConfig.formDefinition._vid ?? 1,
    };

    const existingDrafts = await getServiceRequests({ accessToken, transactionId });

    if (existingDrafts.results && existingDrafts.results.length > 0) {
        const requestId = existingDrafts.results[0].requestId;
        console.log("Draft SR already exist, deleting it", requestId);
        await deleteServiceRequest({ accessToken, transactionId, requestId });
    }

    const createDraftResponse = await createServiceRequest({ accessToken, transactionId, input: { metadata } });
    const getDraftResponse = await getServiceRequest({
        accessToken,
        transactionId,
        requestId: createDraftResponse.requestId,
    });

    return {
        ...getDraftResponse,
        requestId: createDraftResponse.requestId,
        metadata: { ...metadata, currentPage: null },
    };
};

export const createNewDraftIfNotExists = async ({ accessToken, transactionConfig }: Props) => {
    const transactionId = transactionConfig.transactionId;
    const existingDrafts = await getServiceRequests({ accessToken, transactionId });

    if (existingDrafts.results && existingDrafts.results.length > 0) {
        return await getServiceRequest({ accessToken, transactionId, requestId: existingDrafts.results[0].requestId });
    }

    return await createNewDraft({ accessToken, transactionConfig });
};

export const createNewDraftIfNoServiceRequestExists = async ({ accessToken, transactionConfig }: Props) => {
    // check both draft and submitted service requests
    const { serviceRequests, getTrackedRequests } = await getAllServiceRequests({ accessToken });

    if (
        (serviceRequests.results && serviceRequests.results.length > 0) ||
        (getTrackedRequests.requests && getTrackedRequests.requests.length > 0)
    ) {
        return await getAllServiceRequests({ accessToken });
    }

    return await createNewDraft({ accessToken, transactionConfig });
};
