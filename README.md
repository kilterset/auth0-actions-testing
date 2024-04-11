# Auth0 Actions Testing

[![Published on NPM](https://img.shields.io/npm/v/@kilterset/auth0-actions-testing)](https://www.npmjs.com/package/@kilterset/auth0-actions-testing)
[![Built by Kilterset](https://img.shields.io/badge/built_by-Kilterset-ff5f16)](https://kilterset.com)

Allows you to develop and test Auth0 Actions and Okta CIC Actions locally. This project is not affilliated with Auth0.

This library provides you with the setup to test complex actions. Customise test event payloads using realistic, randomized data. Test Action behaviour such as `fetch`ing an external service, providing event secrets, setting metadata, caching data, denying access, redirecting users mid-login, and more. Provides type-hinting to your editor.

The following [Flows](https://auth0.com/docs/customize/actions/flows-and-triggers) are supported:

| Flow                   | Support           |
| ---------------------- | ----------------- |
| Login                  | ✓ from v0.1.0     |
| Machine to Machine     | ✓ pending release |
| Password Reset         | ✓ pending release |
| Pre User Registration  | ✓ pending release |
| Post User Registration | ✓ pending release |
| Post Change Password   | planned           |
| Send Phone Message     | planned           |


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
const { nodeTestRunner } = require("@kilterset/auth0-actions-testing");

test("Lucky Number", async (t) => {
  // Set up the test context
  const { auth0 } = await nodeTestRunner.actionTestSetup(t);

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

(You can set this as your `test` script command in your `package.json`.)

For more examples, see [the examples directory](https://github.com/kilterset/auth0-actions-testing/tree/main/examples).

These include testing `fetch` requests, testing redirect JWTs, and more.

## Using `require`

In Auth0, dependencies are configured in the Action editor.

When testing locally, you'll need to adding the dependency to your `package.json` first:

```sh
npm install axios --save-dev
```

## Customizing the `event`

Each `event` contains realistic, randomized data by default. Each Flow's [documentation](https://auth0.com/docs/customize/actions/flows-and-triggers) explains the `event` object in detail.

The philosophy behind this library is that you are more likely to catch bugs when you randomize data than if you test the same static data each time.

```js
const action = auth0.mock.actions.postLogin();
console.log(action.user);
```

The first time you run this test, you might get:

```js
{ user_id: 'auth0|978f3d31c89b09fc1e841177', ... }
```

The second time, you might get:

```js
{ user_id: 'adfs|822f97ea51247948366e0275', ... }
```

Some event properties can be optional. On some test runs they will be `undefined`, on others they might be set to a valid value. Some properties may include variable lists of values. The length of these lists may change each test run.

If the behaviour of your Action depends on a property of the event being a particular value, it should be expliclity defined in your test:

```js
const action = auth0.mock.actions.postLogin({
  user: auth0.mock.user({
    user_id: 'an-explicit-id',
    name: 'Barry'
  }),
});
```

In this example, `auth0.mock.user` will return a user with randomized properties _except_ for `user_id` and `name`, which will now always return `'an-explicit-id'` and `'Barry'` for this test.

## Testing `api` calls

Each Flow's [documentation](https://auth0.com/docs/customize/actions/flows-and-triggers) explains the `api` object in more detail.

Testing is typically done by checking the state of the action after it's run. For example:

```js
exports.onExecutePostLogin = async (event, api) => {
  api.access.deny("Nobody is allowed!");
}
```

The test:

```js
const action = auth0.mock.actions.postLogin();
await action.simulate(onExecutePostLogin);

ok(action.access.denied, 'Expected access to be denied');
match(action.access.denied.reason, /nobody is allowed/i, 'Unexpected message');
```

Take a look at [the examples directory](https://github.com/kilterset/auth0-actions-testing/tree/main/examples) or the type hinting on the `actions` object to learn which properties to assert against.

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

## Running in CI

See [our GitHub Actions example](https://github.com/kilterset/auth0-actions-testing/blob/main/examples/github-action.yml).
