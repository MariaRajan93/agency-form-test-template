import { fail } from "k6";
import http from "k6/http";
import { config } from "../../../config/config.ts";
import type { TransactionConfigurationResponseDto } from "../../../../libs/types/transactionConfiguration.d.ts"


type Props = {
    transactionId: string;
    includeFormDefinition: boolean;
};

export const getTransactionConfiguration = async ({ transactionId, includeFormDefinition }: Props) => {
    const response = await http.asyncRequest(
        "GET",
        config.TC_SERVICE_URL + "/transactions/" + transactionId + "?includeFormDefinition=" + includeFormDefinition,
        undefined,
        {
            headers: {
                "Content-Type": "application/json",
            },
            tags: { name: "Get Transaction Configuration" },
        }
    );

    if (response.status !== 200) {
        fail(`Error getting transaction configuration: ${response.status_text} ${JSON.stringify(response.body)}`);
    }
    return response.json() as unknown as TransactionConfigurationResponseDto;
};
