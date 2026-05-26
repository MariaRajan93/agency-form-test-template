import { bifSubscribeAndProcess } from "../../steps/bif/average/bifSubscribeAndProcess.ts";
import { baseOptions } from "../baseOptions.ts";

export const options = {
    ...baseOptions,
    scenarios: {
        subscribers: {
            exec: "bifSubscribe",
            executor: "constant-vus",
            vus: 2, // 2 processors to alternate between the two subscribers, so 1 processor per queue.
            duration: "30s", // set to "60m" for 1 hour test
        },
    },
    thresholds: {
        ...baseOptions.thresholds,
    },
};

const bifSubscribe = bifSubscribeAndProcess();

export { bifSubscribe };
