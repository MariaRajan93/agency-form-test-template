import { FileInputType, getAttachmentPolicy } from "../../api/agency/getAttachmentPolicy.ts";
import { uploadFileToS3 } from "../../api/agency/uploadFileToS3.ts";
import { GapiSubjectId, updateServiceRequest } from "../../api/updateServiceRequest.ts";
import { generateUUID } from "../../utils/generateUUID.ts";
import {
    bifGetPresignedUrlDurationTrend,
    bifUpdateServiceRequestDurationTrend,
    upload1MBApiTrend,
} from "../../metrics.ts";
import { check } from "k6";
import type {MyQldServiceRequestMetadata } from "../../../../libs/types/gql.d.ts"

export type FileValueType = {
    hash: string;
    instanceIdentifier: string;
    key: string;
    name: string;
    originalName: string;
    size: number;
    storage: string;
    type: string;
};

const TEST_FILE_SIZE = 1024; // keep it to 1KB to avoid long upload times so we can load up the queue quicker

export const attachFiles = async ({
    access_token,
    transactionId,
    requestId,
    metadata,
    numberOfFiles = 1,
}: {
    access_token: string;
    transactionId: string;
    requestId: string;
    metadata: MyQldServiceRequestMetadata;
    numberOfFiles?: number;
}) => {
    const files = [];
    for (let i = 0; i < numberOfFiles; i++) {
        const fileInput: FileInputType = {
            fieldApiKey: "filev2",
            instanceIdentifier: generateUUID(),
            name: `test_file.txt`,
            size: TEST_FILE_SIZE,
            type: "text/plain",
        };

        const attachmentPolicyStartTime = Date.now();
        const { url, attachmentPolicy } = await getAttachmentPolicy({
            accessToken: access_token,
            subjectId: GapiSubjectId.CITIZEN,
            transactionId,
            requestId,
            file: fileInput,
        });
        const attachmentPolicyEndTime = Date.now();
        bifGetPresignedUrlDurationTrend.add(attachmentPolicyEndTime - attachmentPolicyStartTime);

        check(attachmentPolicy, { "BIF - Getting attachment policy successful": (r) => !!r.key });

        const testFile = "a".repeat(TEST_FILE_SIZE);

        const startUploadFileTrend = Date.now();
        const response = await uploadFileToS3(
            { name: fileInput.name, data: testFile, type: fileInput.type },
            attachmentPolicy,
            url
        );
        const endUploadFileTrend = Date.now();
        upload1MBApiTrend.add(endUploadFileTrend - startUploadFileTrend);
        check(response, { "BIF - Successful file upload": (r) => r.success });

        const fileValue: FileValueType = {
            hash: "",
            instanceIdentifier: fileInput.instanceIdentifier,
            key: attachmentPolicy.key,
            name: attachmentPolicy.fileName,
            originalName: fileInput.name,
            size: fileInput.size,
            storage: "myQld",
            type: fileInput.type,
        };
        if (response.success) {
            files.push(fileValue);
        }
    }

    const startUpdateFormTrend = Date.now();
    const updateForm = await updateServiceRequest({
        accessToken: access_token,
        transactionId,
        requestId: requestId,
        subjectId: GapiSubjectId.CITIZEN,
        input: {
            metadata: { ...metadata, currentPage: 2 },
            selectedProfileUpdates: [],
            evidence: [],
            status: "DRAFT",
            submissionData: {
                email: "test@example.com",
                favouriteFruit: "banana",
                filev2: files,
            },
        },
    });

    const endUpdateFormTrend = Date.now();
    bifUpdateServiceRequestDurationTrend.add(endUpdateFormTrend - startUpdateFormTrend);
    check(updateForm, {
        "BIF - SR Update Successful": (r) => !!r && r.updateMyQLDServiceRequest === "",
    });

    return files;
};
