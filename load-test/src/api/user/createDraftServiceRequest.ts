import { performGapiOperation } from "../performGapiOperation.ts";
import type { MyQldServiceRequestCreateDraftInput } from "../../../../libs/types/gql.d.ts"
import type { MyQldServiceRequestCreateDraftResponse } from "../../../../libs/types/gql.d.ts"


type Props = {
    accessToken: string;
    transactionId: string;
    input: MyQldServiceRequestCreateDraftInput;
};

export const createServiceRequest = async ({
    accessToken,
    transactionId,
    input,
}: Props): Promise<MyQldServiceRequestCreateDraftResponse> => {
    const { createDraftMyQLDServiceRequest } = await performGapiOperation<{
        createDraftMyQLDServiceRequest: MyQldServiceRequestCreateDraftResponse;
    }>({
        accessToken,
        operationName: "CreateDraftMyQLDServiceRequest",
        query: query,
        variables: { transactionId, input, subjectId: "citizen" },
    });
    return createDraftMyQLDServiceRequest;
};

const query = `
    mutation CreateDraftMyQLDServiceRequest(
        $input: MyQLDServiceRequestCreateDraftInput!
        $subjectId: String!
        $transactionId: ID!
    ) {
        createDraftMyQLDServiceRequest(input: $input, subjectId: $subjectId, transactionId: $transactionId) {
            requestId
            transactionId
            submissionData
            metadata {
                projectId
                formId
                revisionNo
                currentPage
                dtpVersionNumber
                dtpVersionSignature
            }
            status
            created
            updated
        }
    }
`;
