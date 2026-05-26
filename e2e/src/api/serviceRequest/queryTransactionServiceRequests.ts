import { Client } from "@urql/core";

export type QueryTransactionsResult = {
  transactionId: string;
  requestId: string;
  __typename: string;
};

export const queryTransactionServiceRequests = async (
  transactionId: string,
  client: Client
): Promise<QueryTransactionsResult[]> => {
  const result = await client
    .query(query, { transactionId, status: "DRAFT", subjectId: "citizen" })
    .toPromise();
  if (!!result.error) throw new Error(result.error?.message);
  return result?.data?.transactionServiceRequests?.results ?? [];
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
