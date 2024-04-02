# Auth0 Actions Testing

## Getting started

### Install Node.js v18

**Important:** This library only supports **Node v18**, which is the latest version of Node.js Auth0 supports at time of writing.

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

You can write tests with the built-in [Node.js Test Runner](https://nodejs.org/docs/latest-v18.x/api/test.html).

Here's a simple Action which records a lucky number on the user's `app_metadata` if they don't already have one:

```js
exports.onExecutePostLogin = async (event, api) => {
  if (event.user.app_metadata['lucky_number']) {
    // Do nothing. User already has a lucky number.
    return;
  }

  const diceRoll = Math.round(Math.random() * event.secrets.MAX_LUCKY_NUMBER);

  api.user.setAppMetadata('lucky_number', diceRoll);
}
```

There are two scenarios to test:

1. When the metadata hasn't been set, we should generate a new lucky number
2. When the metadata has been set previously, we should leave the lucky number intact

Here's how we can test them:

```js
const test = require("node:test");
const { ok, strictEqual } = require("node:assert");
const { onExecutePostLogin } = require("./code");

const {
  actionTestSetup,
} = require("@kilterset/auth0-actions-testing/node-test-runner");

test("onExecutePostLogin", async (t) => {
  const { fetchMock, auth0 } = await actionTestSetup(t);

  await t.test("records a lucky number", async () => {
    const action = auth0.mock.actions.postLogin({
      secrets: { MAX_LUCKY_NUMBER: 42 },
      user: auth0.mock.user({
        app_metadata: {},
      }),
    });

    await action.simulate(onExecutePostLogin);

    const { lucky_number } = action.user.app_metadata;

    ok(
      typeof lucky_number === 'number',
      `Expected the user's lucky number to be a number (got ${lucky_number})`
    )

    ok(
      lucky_number < 42,
      `Expected lucky number not to exceed the maximum allowed (got ${lucky_number})`
    )
  });

  await t.test("does not overwrite lucky numbers", async () => {
    const action = auth0.mock.actions.postLogin({
      secrets: { MAX_LUCKY_NUMBER: 42 },
      user: auth0.mock.user({
        app_metadata: { lucky_number: 17 },
      }),
    });

    await action.simulate(onExecutePostLogin);

    const { lucky_number } = action.user.app_metadata;

    strictEqual(
      lucky_number, 17, `Expected the user's lucky number to be unchanged`
    );
  });

});
```

Run this test with:

```sh
node --test
```

For more examples, see [the examples directory](examples).

## Working with `a0deploy`

While you can copy and paste Actions by hand, we recommend exporting and importing Actions with Auth0's [`a0deploy`](https://auth0.com/docs/deploy-monitor/deploy-cli-tool) command-line interface.

Follow the [Configure the Deploy CLI](https://auth0.com/docs/deploy-monitor/deploy-cli-tool/configure-the-deploy-cli#auth0_included_only) guide to get started.

`a0deploy` can help manage all of your Auth0 configuration, but you can limit it to Actions with the `AUTH0_INCLUDED_ONLY` option:

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

We recommend adding your the tests alongside the action:

```
.
└── actions
    └── My Custom Action 1
        ├── code.js
        └── test.js
```
