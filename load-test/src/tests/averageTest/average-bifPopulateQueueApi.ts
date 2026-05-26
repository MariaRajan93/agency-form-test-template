import { bifPopulateQueueProcess } from "../../steps/bif/average/bifPopulateQueueProcess.ts";
import { baseOptions } from "../baseOptions.ts";

const TRANSACTION_ID = "bif-load-testing-with-attachments";

export const options = {
    ...baseOptions,
    scenarios: {
        producer: {
            exec: "bifPopulate",
            executor: "per-vu-iterations",
            iterations: 2, // iterations per VU
            vus: 10, // check documentation to increase available VUs
            maxDuration: "60m",
        },
    },
    thresholds: {
        ...baseOptions.thresholds,
    },
};

const bifPopulate = bifPopulateQueueProcess({
    transactionId: TRANSACTION_ID,
    includeAttachments: true,
});

export { bifPopulate };
