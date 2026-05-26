import { performGapiOperation } from "../performGapiOperation.ts";
import type { MyQldServiceRequestResponseResults } from "../../../../libs/types/gql.d.ts"
import type { MyQldGetTrackedRequestsResponse } from "../../../../libs/types/gql.d.ts"

type Props = {
    accessToken: string;
    transactionId?: string;
};

type GetAllServiceRequestsResponse = {
    serviceRequests: MyQldServiceRequestResponseResults;
    getTrackedRequests: MyQldGetTrackedRequestsResponse;
};

export const getServiceRequests = async ({
    accessToken,
    transactionId,
}: Props): Promise<MyQldServiceRequestResponseResults> => {
    const { transactionServiceRequests } = await performGapiOperation<{
        transactionServiceRequests: MyQldServiceRequestResponseResults;
    }>({
        accessToken,
        operationName: "TransactionServiceRequests",
        query: query,
        variables: { transactionId, status: "DRAFT", subjectId: "citizen" },
    });
    return transactionServiceRequests;
};

const query = `query TransactionServiceRequests($transactionId: ID!, $status: String, $subjectId: String!) {
    transactionServiceRequests(transactionId: $transactionId, status: $status, subjectId: $subjectId) {
      results {
        transactionId
        created
        requestId
      }
    }
  }`;

export const getAllServiceRequests = async ({ accessToken }: Props): Promise<GetAllServiceRequestsResponse> => {
    const { serviceRequests, getTrackedRequests } = await performGapiOperation<{
        serviceRequests: MyQldServiceRequestResponseResults;
        getTrackedRequests: MyQldGetTrackedRequestsResponse;
    }>({
        accessToken,
        operationName: "GetRequests",
        query: allRequestsQuery,
        variables: { subjectId: "citizen", limitServiceRequests: "1", limitTrackedRequests: "1" },
    });
 
    return { serviceRequests, getTrackedRequests };
};

const allRequestsQuery = `query GetRequests($subjectId: String!, $limitServiceRequests: String, $limitTrackedRequests: String) {
    serviceRequests(subjectId: $subjectId, limit: $limitServiceRequests) {
      results {
        transactionId
        requestId
      }
    }
    getTrackedRequests(subjectId: $subjectId, limit: $limitTrackedRequests) {
        requests {
        referenceNum
      }
    }
  }`;
