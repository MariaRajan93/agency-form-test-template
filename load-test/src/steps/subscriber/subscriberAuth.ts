import { fail } from 'k6';
import http from 'k6/http';
import encoding from 'k6/encoding';
import {
  getIterationBasedSubscriberClientId,
  getIterationBasedSubscriberClientSecret,
} from '../../utils/subscriberClient.ts';
import { config } from '../../../config/config.ts';

export const authenticateSubscriber = async () => {
  const clientId = getIterationBasedSubscriberClientId();
  if (!clientId) {
    throw new Error('LOAD_TEST_SUBSCRIBER_CLIENT_IDS is not set');
  }

  const clientSecret = getIterationBasedSubscriberClientSecret();
  if (!clientSecret) {
    throw new Error('LOAD_TEST_SUBSCRIBER_CLIENT_SECRETS is not set');
  }

  return await exchangeClientCredentials({ clientId, clientSecret });
};

const exchangeClientCredentials = async ({
  clientId,
  clientSecret,
}: {
  clientId: string;
  clientSecret: string;
}) => {
  const credentials = encoding.b64encode(`${clientId}:${clientSecret}`);
  const tokenResponse = await http.asyncRequest(
    'POST',
    `https://www.${config.TEST_RUNNER_ENV}.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token`,
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      tags: {
        name: 'IDB Exchange Client Credentials',
      },
    },
  );

  const accessToken = tokenResponse.json('access_token');
  const expiresIn = Number(tokenResponse.json('expires_in'));

  if (typeof accessToken !== 'string') {
    fail('Token exchange failed');
  }

  return { accessToken, expiresIn };
};
