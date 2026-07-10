#!/bin/bash

# Check required environment variables
if [[ -z "$E2E_DTP_GAPI_URL" || -z "$E2E_SUBSCRIBER_CLIENT_ID" || -z "$E2E_SUBSCRIBER_CLIENT_SECRET" || -z "$E2E_TEST_RUNNER_ENV" || -z "$E2E_TEST_OUTCOME" || -z "$E2E_DTP_FORM_NAME" ]]; then
  echo "Missing one or more required environment variables:"
  echo "E2E_DTP_GAPI_URL, E2E_SUBSCRIBER_CLIENT_ID, E2E_SUBSCRIBER_CLIENT_SECRET, E2E_TEST_RUNNER_ENV, E2E_TEST_OUTCOME, E2E_DTP_FORM_NAME"
  exit 1
fi

# Get access token
access_token=$(curl --silent --location --request POST "https://www.${E2E_TEST_RUNNER_ENV}.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token" \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode "client_id=$E2E_SUBSCRIBER_CLIENT_ID" \
  --data-urlencode "client_secret=$E2E_SUBSCRIBER_CLIENT_SECRET") || {
  echo "Failed to get token response"
  exit 1
}

# Extract token safely
access_token=$(echo "$access_token" | jq -r .access_token)

if [[ -z "$access_token" || "$access_token" == "null" ]]; then
  echo "❌ Failed to retrieve access token"
  exit 1
fi

# Get current UTC timestamp
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Define GraphQL payload
read -r -d '' payload <<EOF
{
  "query": "mutation MyQLDTransactionTestResultPublish(\$input: MyQLDTransactionTestResultEvent!) { myQLDTransactionTestResultPublish(input: \$input) { success } }",
  "variables": {
    "input": {
      "env": "$E2E_TEST_RUNNER_ENV",
      "outcome": "$E2E_TEST_OUTCOME",
      "transactionId": "$E2E_DTP_FORM_NAME",
      "timestamp": "$timestamp"
    }
  }
}
EOF

# Send POST request to GraphQL endpoint
response=$(curl --silent --location --request POST "$E2E_DTP_GAPI_URL" \
  --header "Authorization: Bearer $access_token" \
  --header 'Content-Type: application/json' \
  --data "$payload")

# Print response
echo "GraphQL response:"
echo "$response"
