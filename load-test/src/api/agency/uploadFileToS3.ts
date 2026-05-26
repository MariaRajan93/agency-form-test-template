import http from "k6/http";
import encoding from "k6/encoding";
import { MyQLDCreateAttachmentPolicyType } from "./getAttachmentPolicy.ts";
import { failedUploadToS3Counter } from "../../metrics.ts";
import { Trend } from "k6/metrics/index";

export const uploadFileToS3 = async (
    file: {
        name: string;
        data: string;
        type: string;
    },
    policy: MyQLDCreateAttachmentPolicyType,
    url: string,
    uploadFileTrend?: Trend
): Promise<{ success: boolean; error?: string }> => {
    try {
        const parsedPolicy = JSON.parse(encoding.b64decode(policy.policy, "std", "s")) as {
            conditions: Array<Record<string, string> | Array<string>>;
        };
        const fd = new FormData();

        fd.append("key", getPolicyValue(parsedPolicy.conditions, "key"));
        fd.append("acl", getPolicyValue(parsedPolicy.conditions, "acl"));
        fd.append("policy", policy.policy);
        fd.append("x-amz-credential", getPolicyValue(parsedPolicy.conditions, "X-Amz-Credential"));
        fd.append("x-amz-algorithm", "AWS4-HMAC-SHA256");
        fd.append("x-amz-date", getPolicyValue(parsedPolicy.conditions, "X-Amz-Date"));
        fd.append("x-amz-signature", policy.signature);
        fd.append("Content-Type", file.type);
        fd.append("x-amz-security-token", getPolicyValue(parsedPolicy.conditions, "X-Amz-Security-Token"));
        fd.append("content-disposition", getPolicyValue(parsedPolicy.conditions, "content-disposition"));
        fd.append("success_action_status", "200");

        fd.append("file", file, "text.txt");

        const startUploadFileTrend = Date.now();
        const response = http.post(url, fd.body(), {
            headers: {
                "Content-Type": `multipart/form-data; boundary=${fd.boundary}`,
            },
            timeout: "300s",
        });
        const endUploadFileTrend = Date.now();
        if (response.status < 200 || response.status >= 300)
            throw new Error(`Upload failed with status: ${response.status}, body: ${response.body}`);

        if (uploadFileTrend) uploadFileTrend.add(endUploadFileTrend - startUploadFileTrend);

        return { success: true };
    } catch (error) {
        failedUploadToS3Counter.add(1);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
};

const getPolicyValue = (conditions: Array<Record<string, string> | Array<string>>, key: string): string => {
    const condition = conditions.find((c) => typeof c === "object" && key in c) as Record<string, string>;
    return condition ? condition[key] : "";
};

interface Field {
    name: string;
    value: string | { name: string; data: string; type: string };
    filename?: string;
}

// This class is needed to create a multipart/form-data request body for S3 upload as S3 upload requires a specific
// ordered format not supported by k6's http.post method. This class is based on the example provided in the k6 docs
// https://grafana.com/docs/k6/latest/examples/data-uploads/#multipart-request-uploading-a-file
// Could refactor to seperate file if needed elsewhere.
class FormData {
    private readonly _boundary: string;
    private readonly _fields: Field[];

    constructor() {
        this._boundary = `------------------------${Math.random().toString(36).substring(2)}`;
        this._fields = [];
    }

    append(name: string, value: string | { name: string; data: string; type: string }, filename?: string): void {
        this._fields.push({ name, value, filename });
    }

    get boundary(): string {
        return this._boundary;
    }

    body(): string {
        let body = "";
        this._fields.forEach((field) => {
            if (!field.filename) {
                body += `--${this.boundary}\r\n`;
                body += `Content-Disposition: form-data; name="${field.name}"\r\n\r\n`;
                body += `${typeof field.value === "string" ? field.value : JSON.stringify(field.value)}\r\n`;
            }
        });
        const fileField = this._fields.find((field) => field.filename);
        if (fileField) {
            body += `--${this.boundary}\r\n`;
            body += `Content-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\n`;
            body += `Content-Type: ${typeof fileField.value === "object" && "type" in fileField.value
                    ? fileField.value.type
                    : "application/octet-stream"
                }\r\n\r\n`;
            if (typeof fileField.value === "object" && "data" in fileField.value) {
                body += fileField.value.data;
            }
            body += "\r\n";
        }

        body += `--${this.boundary}--\r\n`;
        return body;
    }
}
