import { performGapiOperation } from "../performGapiOperation.ts";

type Data = {
    myQLDCreateAttachmentPolicy: {
        data: MyQLDCreateAttachmentPolicyType;
        url: string;
        __typename: string;
    };
};

export type MyQLDCreateAttachmentPolicyType = {
    acl: string;
    awsAccessKeyId: string;
    contentDisposition: string;
    contentType: string;
    fileName: string;
    key: string;
    policy: string;
    signature: string;
    __typename?: string;
};

export type FileInputType = {
    fieldApiKey: string;
    instanceIdentifier: string;
    name: string;
    size: number;
    type: string;
};

export const getAttachmentPolicy = async ({
    accessToken,
    subjectId,
    transactionId,
    requestId,
    file,
}: {
    accessToken: string;
    subjectId: string;
    transactionId: string;
    requestId: string;
    file: FileInputType;
}): Promise<{ attachmentPolicy: MyQLDCreateAttachmentPolicyType; url: string }> => {
    const data = await performGapiOperation<Data>({
        accessToken,
        operationName: "MyQLDCreateAttachmentPolicy",
        query: query,
        variables: { subjectId, transactionId, requestId, input: { ...file } },
    });
    return { attachmentPolicy: data.myQLDCreateAttachmentPolicy.data, url: data.myQLDCreateAttachmentPolicy.url };
};

export const query = `mutation MyQLDCreateAttachmentPolicy($transactionId: ID!, $requestId: ID!, $subjectId: String!, $input: MyQLDCreateAttachmentPolicyInput!) {
    myQLDCreateAttachmentPolicy(
        transactionId: $transactionId
        requestId: $requestId
        subjectId: $subjectId
        input: $input
    ) {
        data {
            awsAccessKeyId
            contentDisposition
            contentType
            acl
            fileName
            key
            policy
            signature
            __typename
        }
        url
        __typename
    }
}`;
