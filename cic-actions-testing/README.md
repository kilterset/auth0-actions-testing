# CIC Actions Testing

## Getting started

Create your project and install the library:

```sh
npm init
npm install @kilterset/cic-actions-testing --save-dev
```

## Working with `a0deploy`

While you can copy and paste actions by hand, we recommend exporting and importing Actions with Auth0's [`a0deploy`](https://auth0.com/docs/deploy-monitor/deploy-cli-tool).

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
