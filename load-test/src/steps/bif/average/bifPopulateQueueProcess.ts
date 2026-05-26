import { bifSubmitApi } from "../../../scripts/bif/bifSubmitApi.ts";
import { getTransactionConfiguration } from "../../../api/public/getTransactionConfiguration.ts";
import type { TransactionConfigurationResponseDto } from "../../../../../libs/types/transactionConfiguration.d.ts"

let transactionCache: TransactionConfigurationResponseDto;

const getTransaction = async (transactionId: string) => {
    if (!transactionCache) {
        transactionCache = await getTransactionConfiguration({ transactionId, includeFormDefinition: true });
    }
    return transactionCache;
};

export const bifPopulateQueueProcess =
    (options: { transactionId: string; includeAttachments?: boolean }) => async () => {
        // Populate messages on the queue
        await bifSubmitApi(options.transactionId, async () => getTransaction(options.transactionId), options.includeAttachments);
    };
