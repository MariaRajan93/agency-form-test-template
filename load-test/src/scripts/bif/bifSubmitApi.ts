import { updateServiceRequest, GapiSubjectId } from "../../api/updateServiceRequest.ts";
import { bifSubmissionsCounter, bifSubmitServiceRequestDurationTrend } from "../../metrics.ts";
import { fetchAccessToken } from "../../steps/auth.ts";
import { createNewDraft } from "../../steps/dtp/createNewDraft.ts";
import { getIterationBasedUserIdDTP } from "../../utils/getUserIds.ts";
import { attachFiles, FileValueType } from "./bifAttachFiles.ts";
import { check } from "k6";
import type { TransactionConfigurationResponseDto } from "../../../../libs/types/transactionConfiguration.d.ts"
import type {MyQldServiceRequestMetadata } from "../../../../libs/types/gql.d.ts"

export const bifSubmitApi = async (
    transactionId: string,
    getTransactionConfiguration: () => Promise<TransactionConfigurationResponseDto>,
    includeAttachments = false
) => {
    const userId = getIterationBasedUserIdDTP();
    const access_token = await fetchAccessToken(userId);
    const transactionConfig = await getTransactionConfiguration();

    // submit multiple requests to fill the queue with messages
    const { metadata, requestId } = await createNewDraft({ accessToken: access_token, transactionConfig });

    let files: FileValueType[] = [];
    if (includeAttachments) {
        // Attach random number of files to the request (1-5)
        const numberOfFiles = Math.floor(Math.random() * 5) + 1;
        const attachedFiles = await attachFiles({
            access_token,
            transactionId,
            requestId,
            metadata,
            numberOfFiles,
        });
        files = attachedFiles || [];
    }

    const startSubmitForm = Date.now();
    const submission = await submitForm({ accessToken: access_token, transactionId, requestId, metadata, files });
    const endSubmitForm = Date.now();
    bifSubmitServiceRequestDurationTrend.add(endSubmitForm - startSubmitForm);

    check(submission, {
        "BIF - Submission Successful": (r) => !!r && r.updateMyQLDServiceRequest === "",
    });

    bifSubmissionsCounter.add(1);
};

const submitForm = async ({
    accessToken,
    transactionId,
    requestId,
    metadata,
    files = [],
}: {
    accessToken: string;
    transactionId: string;
    requestId: string;
    metadata: MyQldServiceRequestMetadata;
    files?: FileValueType[];
}) => {
    return await updateServiceRequest({
        accessToken,
        transactionId,
        requestId: requestId,
        subjectId: GapiSubjectId.CITIZEN,
        input: {
            metadata: { ...metadata, currentPage: 2 },
            selectedProfileUpdates: [],
            evidence: [],
            status: "SUBMITTED",
            submissionData: {
                email: "bifTest@example.com",
                favouriteFruit: "banana",
                filev2: files.length > 0 ? files : undefined,
                consentAndDeclaration: {
                    consentConfirmation: {
                        agreeToReadAndUnderstandInfo: true,
                        consentToCollectionAndUseOfPersonalInfo: true,
                        consentToShareDigitalIdentity: true,
                    },
                    consentDeclaration: true,
                },
            },
        },
    });
};
