import { authenticateSubscriber } from "../../subscriber/subscriberAuth.ts";
import { bifConsumeQueue } from "./bifConsumeQueue.ts";

interface CachedTokenData {
    accessToken: string;
    expiresAt: number; // timestamp in milliseconds
}

let cachedTokenData: CachedTokenData | null = null;
let tokenRefreshPromise: Promise<CachedTokenData> | null = null;

const TOKEN_REFRESH_BUFFER = 60 * 1000; // 60 seconds in milliseconds

export const bifSubscribeAndProcess = (): (() => Promise<void>) => async () => {
    if (!cachedTokenData || Date.now() >= cachedTokenData.expiresAt - TOKEN_REFRESH_BUFFER) {
        if (!tokenRefreshPromise) {
            tokenRefreshPromise = (async (): Promise<CachedTokenData> => {
                const { accessToken, expiresIn } = await authenticateSubscriber();

                const expiresInNum = Number(expiresIn);
                const expiresAt = Date.now() + expiresInNum * 1000;
                console.log(`Token expires in ${(expiresInNum / 60).toFixed(2)} minutes.`);

                return {
                    accessToken,
                    expiresAt,
                };
            })();
        }
        cachedTokenData = await tokenRefreshPromise;
        tokenRefreshPromise = null;
    }

    await bifConsumeQueue({ accessToken: cachedTokenData.accessToken });
};
