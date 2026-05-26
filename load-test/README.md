# K6 Load Tests

## Getting started

1. [Install k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).

    > 📖 [k6 Documentation](https://grafana.com/docs/k6/latest/)

2. Create `.env` file based on `.env.example` file, or retrieve it from your organization's password/secret manager.

## Development workflow

1. Copy the k6config.env.json file in the config folder, replacing `env` with the environment you want to use. Also update {TEST_RUNNER_ENV} in the file contents to match the same environment, for example `uat` or `preprod`.

2. Load the `.env` file.

    ```bash
    set -a && source .env && set +a
    ```

3. Use the k6 CLI to run your test scenario. To perform a BIF test, first populate the queue with submissions.

    ```bash
    k6 run src/tests/averageTest/average-bifPopulateQueueApi.ts
    ```

    Once the queue is populated, run the test to process the queue (it may take some time for submissions to reach the queue from the populate queue script).

    ```bash
    k6 run src/tests/averageTest/average-bifProcessQueueApi.ts
    ```

### Common pitfalls

- [k6 isn’t Node.js or a browser. Packages that rely on APIs provided by Node.js, for instance the os and fs modules, won’t work in k6. The same goes for browser-specific APIs, such as the window object.](https://grafana.com/docs/k6/latest/using-k6/modules/#use-nodejs-modules)
- Relative imports need to include the file extension e.g. `./utils.ts` otherwise the test will fail.

## Running load tests on the cloud

1. [Setup k6 cloud login](https://grafana.com/docs/grafana-cloud/testing/k6/author-run/tokens-and-cli-authentication/)

2. Load the `.env` file.

    ```bash
    set -a && source .env && set +a
    ```

3. Assuming you have permission and have notified the concerned parties, use the k6 CLI to run your test scenario. For example:

    ```bash
    k6 cloud run src/tests/debug.ts
    ```

## Viewing the results locally

### Web dashboard

K6 offers local [web dashboard](https://grafana.com/docs/k6/latest/results-output/web-dashboard/) to view summarised test results. Additional k6 parameters can be added to `.env` to enable the web dashboard.

```bash
K6_WEB_DASHBOARD=true
K6_WEB_DASHBOARD_OPEN=true
K6_WEB_DASHBOARD_PORT=5665
K6_WEB_DASHBOARD_PERIOD=1s # Update frequency for the web dashboard. Needs to be less than 1/3 of the test duration.
```

### Generating and processing json output

K6 allows the test output to be generated in different formats, including [json output](https://grafana.com/docs/k6/latest/results-output/real-time/json/).

```bash
k6 run src/tests/dtpMinimalApi.ts --out json=results.json
```

Once json output is generated, basic network statistics can be displayed using the custom helper script.

```bash
source helpers/parse_json_results.sh results.json
```

### Troubleshooting

1. How to install chromium-browser correctly for the windows users

    ```bash
    sudo apt install -y chromium-browser
    ```
