import http from "k6/http";
import { config } from "../../../config/config.ts";

export const getPdfAsAgency = async ({
    accessToken,
    subjectId,
    transactionId,
    requestId,
    mode,
}: {
    accessToken: string;
    subjectId: string;
    transactionId: string;
    requestId: string;
    mode: "agency" | "customer";
}) => {
    const response = await http.asyncRequest(
        "GET",
        `${config.DTP_PDF_GENERATOR_URL}/customers/${subjectId}/transactions/${transactionId}/requests/${requestId}/pdf?mode=${mode}`,
        null,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            tags: {
                name: `DTP PDF Generator Get PDF (${mode})`,
            },
        }
    );
    return response.body;
};
