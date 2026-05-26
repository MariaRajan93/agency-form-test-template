import { fail, type JSONArray, type JSONObject } from "k6";
import http from "k6/http";
import { config } from "../../config/config.ts";

export const performGapiOperation = async <TData extends JSONObject = JSONObject>(options: {
    accessToken: string;
    operationName: string;
    query: string;
    variables?: Record<string, unknown>;
}): Promise<TData> => {
    const response = await http.asyncRequest(
        "POST",
        config.GAPI_URL,
        JSON.stringify({
            operationName: options.operationName,
            query: options.query,
            variables: options.variables,
        }),
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${options.accessToken}`,
            },
            tags: {
                name: `GAPI ${options.operationName}`,
            },
        }
    );

    if (response.status !== 200) {
        fail(
            `[Error calling GAPI] Operation: ${options.operationName}, status: ${
                response.status_text
            }, response: ${JSON.stringify(response.json())}`
        );
    }

    const { data, errors } = response.json() as { data?: TData; errors?: JSONArray };

    if (errors || !data) {
        fail(`[Errors returned from GAPI] Operation: ${options.operationName}, error: ${JSON.stringify(errors)}`);
    }

    return data;
};
