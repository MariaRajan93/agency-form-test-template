# Playwright E2E Tests

## Setting up

### Set up your project

1. Install Node.js:

    Visit the Node.js official website and download the installer for your operating system.
    Follow the installation instructions provided for your specific OS.
    This will also install npm [Node Package Manager](https://nodejs.org/en) automatically.

    Alternatively, you can install Node.js using a version manager like nvm package manager.

    ```bash
    # Install nvm (Linux/Mac)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

    # Restart your terminal or run the following command
    source ~/.bashrc

    # Install the latest version of Node.js
    nvm install node
    ```

2. Install PNPM:

    After Node.js and npm are installed, you can install pnpm globally using npm:

    ```bash
    npm install -g pnpm
    ```

3. Verify the Installation:
   You can verify that Node.js, npm, and pnpm are installed correctly by checking their versions:

    ```bash
    node -v
    npm -v
    pnpm -v
    ```

#### Installing playwright

In a new terminal, run the following:

```bash
pnpm view playwright version
pnpm dlx playwright install --with-deps
```

More details can be found at: [Playwright Website](https://playwright.dev/docs/intro#installing-playwright)

#### Setting up environment variables

To run E2E tests, environment variables will need to be set. Make sure that a .env file is created
in the root of the project folder `agency-form-test-template` based off the corresponding .env.example files

### Install project dependencies

```bash
pnpm install
```

#### Running end to end tests

Run in a deployed environment, like UAT or PreProd

for instance run all tests with pnpm:

```bash
pnpm test
```

### Running end to end tests in Playwright UI Mode

```bash
pnpm test:ui
```

### Test Execution with GitHub Workflow

The YAML pipeline example is configured for a nightly run in .github/workflows/nightly-run.yml. The E2E test runs every midnight, and the result is published to the queue.

#### Write end to end tests

We utilize Playwright with TypeScript and Object Models.

1. Create a Page Object Class: In the src/pages directory, create a file for your page object. For instance,
   if you are testing a login page, name it `LoginPage.page.ts`.

2. Develop Helper Functions: Create API helper functions within the `src/api` directory.
   These will assist in setting up test data for the testing state. There are other helper functions in the `src/utils` and `src/fixtures` directories.

3. Create a Test Specification File: In the `src/tests/AgencyForm` directory, create a file for your test. For example, if you are testing the login functionality, name it Login.spec.ts. For further reference: [Playwright Documentation](https://playwright.dev/docs/writing-tests)
