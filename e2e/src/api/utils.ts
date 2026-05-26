import { Client } from "@urql/core";
import { queryTransactionServiceRequests } from "./serviceRequest/queryTransactionServiceRequests";

// Check before page.goto() to avoid race conditions as page.goto() creates draft if it doesn't exist
export const checkDraftExists = async (
  transactionId: string,
  client: Client
) => {
  const transactions = await queryTransactionServiceRequests(
    transactionId,
    client
  );
  return transactions.length > 0;
};
