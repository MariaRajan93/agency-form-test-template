import { Client } from "@urql/core";

type Props = {
    client: Client;

    subjectId: string;
    transactionId: string;
    requestId: string;
};

export const getPresignedUrls = async ({ client, subjectId, transactionId, requestId }: Props) => {
    const result = await client
        .query(query, {
            subjectId,
            transactionId,
            requestId,
        })
        .toPromise();

    if (!!result.error) throw new Error(result.error?.message);
    return result?.data?.getPresignedUrls?.attachments;
};

const query = `query GetPresignedUrls($subjectId: String!, $transactionId: ID!, $requestId: ID!) {
    getPresignedUrls(subjectId: $subjectId, transactionId: $transactionId, requestId: $requestId) {
      attachments {
        filename
        presignedUrl
      }
    }
  }
`;
