import { performGapiOperation } from "../performGapiOperation.ts";

type Data = {
    getPresignedUrls: { attachments: { filename: string; presignedUrl: string }[] };
};

export const getPresignedUrls = async ({
    accessToken,
    subjectId,
    transactionId,
    requestId,
}: {
    accessToken: string;
    subjectId: string;
    transactionId: string;
    requestId: string;
}) => {
    const data = await performGapiOperation<Data>({
        accessToken,
        operationName: "GetPresignedUrls",
        query: query,
        variables: { subjectId, transactionId, requestId },
    });
    return data.getPresignedUrls.attachments;
};

export const query = `query GetPresignedUrls($subjectId: String!, $transactionId: ID!, $requestId: ID!) {
  getPresignedUrls(subjectId: $subjectId, transactionId: $transactionId, requestId: $requestId) {
    attachments {
      filename
      presignedUrl
    }
  }
}`;
