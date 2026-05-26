import { JSONObject } from "k6";
import { performGapiOperation } from "../performGapiOperation.ts";

type Props = {
    accessToken: string;
    transactionId: string;
    requestId: string;
};

export const deleteServiceRequest = async ({ accessToken, transactionId, requestId }: Props) => {
    const { discardMyQLDServiceRequestDraft } = await performGapiOperation<{
        discardMyQLDServiceRequestDraft: JSONObject;
    }>({
        accessToken,
        operationName: "DiscardMyQLDServiceRequestDraft",
        query: query,
        variables: { transactionId, requestId, subjectId: "citizen" },
    });
    return discardMyQLDServiceRequestDraft;
};

const query = `mutation DiscardMyQLDServiceRequestDraft($requestId: ID!, $subjectId: String!, $transactionId: ID!) {
    discardMyQLDServiceRequestDraft(requestId: $requestId, subjectId: $subjectId, transactionId: $transactionId)
  }
`;
