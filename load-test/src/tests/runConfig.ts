import { SharedIterationsScenario } from "k6/options";

type RunConfig = {
    executor: SharedIterationsScenario["executor"];
    vus: number;
    iterations: number;
};

export const apiSingleRunConfig: RunConfig = {
    executor: "shared-iterations",
    vus: 1,
    iterations: 1,
};

export const uiSingleRunConfig = {
    ...apiSingleRunConfig,
    options: {
        browser: {
            type: "chromium",
        },
    },
};
