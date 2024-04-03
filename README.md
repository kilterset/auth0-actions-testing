# Auth0 Actions Testing

[![Published on NPM](https://img.shields.io/npm/v/@kilterset/auth0-actions-testing)](https://www.npmjs.com/package/@kilterset/auth0-actions-testing)
[![Built by Kilterset](https://img.shields.io/badge/built_by-Kilterset-ff5f16)](https://kilterset.com)

Allows you to develop and test Auth0 Actions and Okta CIC Actions locally.

This library provides you with the setup to test complex actions. Customise test event payloads using realistic, randomized data. Test Action behaviour such as `fetch`ing an external service, providing event secrets, setting metadata, caching data, denying access, redirecting users mid-login, and more.

The following [Flows](https://auth0.com/docs/customize/actions/flows-and-triggers) are supported:

| Flow                   | Support |
| ---------------------- | ------- |
| Login                  | ✓       |
| Machine to Machine     | planned |
| Password Reset         | planned |
| Pre User Registration  | planned |
| Post User Registration | planned |
| Post Change Password   | planned |
| Send Phone Message     | planned |


## Getting started

### Install Node.js v18

**Important:** Node v18 LTS is latest version of Node.js Auth0 currently supports.

Make sure you're running Node v18. If you have a newer version of Node installed, we recommend using a Node version manager such as [`nvm`](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n).

```sh
$ node --version
v18.19.0
```

### Set up your project

Create your project:

```sh
npm init
```

Add `"engines": { "node": "^18.19.0" }` to your `package.json` to enforce the correct version of Node.js:

```diff
{
  "name": "example",
  "version": "1.0.0",
+ "engines": {
+    "node": "^18.19.0"
+  }
}
```

Install the library:

```sh
npm install @kilterset/auth0-actions-testing --save-dev
```

### Writing your first test

You can write tests with the built-in [Node.js Test Runner](https://nodejs.org/docs/latest-v18.x/api/test.html) and [assertions](https://nodejs.org/docs/latest-v18.x/api/assert.html).

Here's a simple Action which records a lucky number on the user's `app_metadata` if they don't already have one:

```js
// code.js
exports.onExecutePostLogin = async (event, api) => {
  const diceRoll = Math.round(Math.random() * event.secrets.MAX_LUCKY_NUMBER);
  api.user.setAppMetadata('lucky_number', diceRoll);
}
```

Let's create a test scenario for this:

```js
// test.js
const test = require("node:test");
const { ok, strictEqual } = require("node:assert");

// Import the action
const { onExecutePostLogin } = require("./code");

// Import the setup for Node Test Runner
const {
  actionTestSetup,
} = require("@kilterset/auth0-actions-testing/node-test-runner");

test("Lucky Number", async (t) => {
  // Set up the test context
  const { auth0 } = await actionTestSetup(t);

  // Each test case needs an `await t.test(...)` call
  await t.test("records a lucky number", async () => {
    // Prepare the action, specifying any explicit preconditions.
    // Any properties you omit will be filled by realistic, random data.
    const action = auth0.mock.actions.postLogin({
      secrets: {
        MAX_LUCKY_NUMBER: 42, // simulate the secrets configured in the Action
      },
      user: auth0.mock.user({
        app_metadata: {},
        // ...any additional user properties you want to explicitly declare
      }),
      // ...other event customisations
      // request: auth0.mock.request({ ... }),
      // authentication: auth0.mock.authentication({ ... }),
      // etc.
    });

    // Simulate your action
    await action.simulate(onExecutePostLogin);

    // Test how the user's app_metadata was updatd
    const { lucky_number } = action.user.app_metadata;

    // Checking equality (see deepStrictEqual for comparing objects)
    strictEqual(
      typeof lucky_number,
      "number",
      "Expected the user's lucky number to be a number"
    );

    // Checking truthiness
    ok(
      lucky_number >=0 && lucky_number <= 42,
      `Expected lucky number to be between 0 and 42 (got ${lucky_number})`
    );
  });
});
```

Run this test with:

```sh
node --test
```

For more examples, see [the examples directory](examples).

These include testing `fetch` requests, testing redirect JWTs, and more.

## Using `require`

In Auth0, dependencies are configured in the Action editor.

When testing locally, you'll need to adding the dependency to your `package.json` first:

```sh
npm install axios --save-dev
```

## Working with `a0deploy`

While you can copy and paste Actions by hand, we recommend exporting and importing Actions with Auth0's [`a0deploy`](https://auth0.com/docs/deploy-monitor/deploy-cli-tool) command-line interface.

Follow the [Configure the Deploy CLI](https://auth0.com/docs/deploy-monitor/deploy-cli-tool/configure-the-deploy-cli#auth0_included_only) guide to get started.

`a0deploy` can help manage all of your Auth0 configuration, but you may want to limit it to Actions initially. You can optionally do this with the `AUTH0_INCLUDED_ONLY` option:

```json
{
  "AUTH0_DOMAIN": "....auth0.com",
  "AUTH0_CLIENT_ID": "...",
  "AUTH0_CLIENT_SECRET": "...",
  "AUTH0_INCLUDED_ONLY": ["actions"]
}
```

Example:

```sh
a0deploy export -c=config.json --format=yaml --output_folder=.
```

Actions will be stored like this:

```
.
├── actions
│   ├── My Custom Action 1
│   │   └── code.js
│   └── My Custom Action 2
│       └── code.js
├── config.json
└── tenant.yaml
```

Follow the Getting Started instructions above to set up the project from here. We recommend adding your the tests alongside the action:

```
.
└── actions
    └── My Custom Action 1
        ├── code.js
        └── test.js
```
