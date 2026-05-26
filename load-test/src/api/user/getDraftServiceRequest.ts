import { performGapiOperation } from "../performGapiOperation.ts";
import type { MyQldTransactionServiceRequestResponse } from "../../../../libs/types/gql.d.ts"

type Props = {
    accessToken: string;
    transactionId: string;
    requestId: string;
};

export const getServiceRequest = async ({
    accessToken,
    transactionId,
    requestId,
}: Props): Promise<MyQldTransactionServiceRequestResponse> => {
    const { transactionServiceRequest } = await performGapiOperation<{
        transactionServiceRequest: MyQldTransactionServiceRequestResponse;
    }>({
        accessToken,
        operationName: "TransactionServiceRequest",
        query: query,
        variables: { transactionId, requestId, subjectId: "citizen" },
    });
    return transactionServiceRequest;
};

const query = `query TransactionServiceRequest($requestId: ID!, $subjectId: String!, $transactionId: ID!) {
  transactionServiceRequest(requestId: $requestId, subjectId: $subjectId, transactionId: $transactionId) {
    created
    metadata {
      formId
      projectId
      revisionNo
      currentPage
    }
    status
    submissionData
    updated
    evidence {
      map {
        attribute
        prefilledFields
      }
      source
      token
    }
  }
}`;
