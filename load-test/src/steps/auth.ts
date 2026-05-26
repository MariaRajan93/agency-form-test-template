import { b64encode } from "k6/encoding";
import http from "k6/http";
import { check } from "k6";
import { config } from "../../config/config.ts";

type AuthenticateUserOptions = {
    userId: string;
    userPassword: string;
    clientId: string;
    clientSecret: string;
};

type CachedTokenData = {
    accessToken: string;
    expiresAt: number; // timestamp in milliseconds
};

export type UserAuthInfo = { access_token: string; id_token: string; refresh_token: string; expires_in: number };

export const getUserAccessToken = async (userId: string) => {
    return getUserAuthInfo({
        userId,
        userPassword: config.LOAD_TEST_USER_PASSWORD,
        clientId: `test-runner-${config.AGENCY_SERVICE}`,
        clientSecret: config.LOAD_TEST_RUNNER_CLIENT_SECRET,
    });
};

const getUserAuthInfo = async (options: AuthenticateUserOptions) => {
    const { userId, userPassword, clientId, clientSecret } = options;

    const params = {
        headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ` + b64encode(`${clientId}:${clientSecret}`),
        },
        tags: {
            name: "IDB Exchange Client Credentials",
        },
    };

    const tokenResponse = await http.asyncRequest(
        "POST",
        `https://www.${config.TEST_RUNNER_ENV}.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token`,
        {
            grant_type: "password",
            username: `test-runner-${config.AGENCY_SERVICE}_user-${userId}`,
            password: userPassword,
            scope: "email openid profile ttg-extras",
        },
        params
    );

    const accessToken = tokenResponse.json("access_token");

    check(accessToken, {
        "Token exchange successful": (token) => typeof token === "string",
    });

    return tokenResponse.json() as UserAuthInfo;
};


/**
 * Get the access token for the user and cache it for future use to reduce calls to IDB during the load testing.
 */
let cachedTokenData: CachedTokenData | null = null;
let tokenRefreshPromise: Promise<CachedTokenData> | null = null;
const TOKEN_REFRESH_BUFFER = 60 * 1000; // 60 seconds in milliseconds

export const fetchAccessToken = async (userId: string) => {
    if (!cachedTokenData || Date.now() >= cachedTokenData.expiresAt - TOKEN_REFRESH_BUFFER) {
        if (!tokenRefreshPromise) {
            tokenRefreshPromise = (async (): Promise<CachedTokenData> => {
                const { access_token, expires_in } = await getUserAccessToken(userId);
                const accessToken = access_token;
                const expiresAt = Date.now() + expires_in * 1000;
                console.log(`Token expires in ${(expires_in / 60).toFixed(2)} minutes.`);

                return {
                    accessToken,
                    expiresAt,
                };
            })();
        }
        cachedTokenData = await tokenRefreshPromise;
        tokenRefreshPromise = null;
    }

    return cachedTokenData.accessToken;
};
