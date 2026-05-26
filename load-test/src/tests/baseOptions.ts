import { type Options } from "k6/options";

export const baseOptions = {
    cloud: {
        distribution: {
            distributionLabel1: { loadZone: "amazon:au:sydney", percent: 100 },
        },
    },
    thresholds: {
        checks: ["rate == 1.0"],
    },
    blockHostnames: [
        "*.newrelic.com",
        "bam.nr-data.net",
        "analytics.google.com",
        "*.google-analytics.com",
        "*.googletagmanager.com",
        "*.hotjar.com",
    ],
} as unknown as Options;
