import { Client } from "@urql/core";
import _ from "lodash";
import { unsubscribe } from "./unsubscribe";
import { subscribe } from "./subscribe";
import { getSubscriptions } from "./getSubscriptions";

export const querySubscriptionsAndSubscribe = async (client: Client, clientId: string, transactionIds: string[]) => {
    console.log("Querying subscriptions and subscribing to transactions");
    const result = await getSubscriptions(client);
    if (!result) return;

    const subscription = result.subscriptions?.find(
        (r) => r?.clientId == clientId && r?.subscriptionSource?.eventType === "myQLDServiceRequestSubscribe"
    );
    const txnIds = subscription?.subscriptionSource?.recordIds?.filter((txn): txn is string => txn != null) ?? [];
    console.log("Subscribed to transactions:", txnIds);
    const newTxns = _.union(txnIds, transactionIds);

    // If there is no change in the transaction ids, do nothing
    if (_.xor(newTxns, txnIds).length == 0) {
        console.log("No change in transaction ids, skipping subscription update");
        return;
    }

    const subscriptionId = subscription?.id;
    if (subscriptionId) {
        // Unsubscribe the old subscription
        console.log("Unsubscribing old subscription");
        await unsubscribe(client, subscriptionId);
    }

    console.log("Subscribing to new transaction ids");
    await subscribe(client, newTxns);
};
