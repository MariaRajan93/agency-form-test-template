import { OperationResult, OperationResultSource } from "@urql/core";

/**
 * Await an urql operation and throw an error if the operation failed.
 * Use for convenient and consistent handling of urql operations.
 */
export const performUrqlOperation = async <Data>(
    operationResultSource: OperationResultSource<OperationResult<Data>>
) => {
    const result = await operationResultSource.toPromise();

    if (result.error) {
        throw result.error;
    }

    if (!result.data) {
        throw new Error("Data was not returned from GraphQL operation.");
    }

    return result.data;
};
