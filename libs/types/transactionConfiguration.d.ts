import type { FormDefinition } from "./formio.d.ts"
type TransactionIpLevel = "IP1" | "IP1PLUS" | "IP2" | "IP2PLUS" | "IP3";

type AgencyPrefillDto = {
    url: string;
    audience: string;
};

export type TransactionConfigurationResponseDto = {
    transactionId: string;
    formTitle: string;
    projectId: string;
    formId: string;
    clientId: string;
    ipLevel: number;
    desiredIpLevel?: TransactionIpLevel;
    hotjarId: string;
    gcsServiceId?: string;
    gcsServiceInteractionId?: string;
    agencyPrefillQuery?: string;
    agencyPrefill?: AgencyPrefillDto;
    created?: number;
    updated?: number;
    formDefinition: FormDefinition;
    singlePageForm?: boolean;
    validationSummary?: {
        valid?: boolean;
        errors?: Array<string>;
    };
    assistedForms?: {
        enabled?: boolean;
        authorisedGroups?: Array<string>;
    };
};
