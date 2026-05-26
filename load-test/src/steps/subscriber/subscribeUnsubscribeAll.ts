import { getSubscriptions } from "../../api/agency/getSubscriptions.ts";
import { unsubscribe } from "../../api/agency/unsubscribe.ts";

export const unsubscribeAll = async ({ accessToken }: { accessToken: string }) => {
    const { subscriptions } = await getSubscriptions({ accessToken });
    await Promise.all(
        subscriptions.map((subscription) => unsubscribe({ accessToken, systemSubscriptionId: subscription.id }))
    );
};
