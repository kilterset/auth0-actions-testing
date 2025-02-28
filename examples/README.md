# Auth0 Actions Testing Examples

In this directory, you'll find examples of common problems in Auth0 Actions, and how to test them. If you can't find the example you're looking for, please [leave an issue on GitHub](https://github.com/kilterset/auth0-actions-testing/issues).

## Flow examples

Examples are organized into [Auth0 Flows](https://auth0.com/docs/customize/actions/flows-and-triggers). Here's a quick guide:

| Flow                   | Trigger                  | Export(s)                                           |
| ---------------------- | ------------------------ | --------------------------------------------------- |
| Login                  | `post-login`             | `onExecutePostLogin`, `onContinuePostLogin`         |
| Machine to Machine     | `credentials-exchange`   | `onExecuteCredentialsExchange`                      |
| Password Reset         | `post-challenge`         | `onExecutePostChallenge`, `onContinuePostChallenge` |
| Post User Registration | `post-user-registration` | `onExecutePreUserRegistration`                      |
| Pre User Registration  | `pre-user-registration`  | `onExecutePreUserRegistration`                      |
| Send Phone Message     | `send-phone-message`     | `onExecuteSendPhoneMessage`                         |

## CI/CD examples

See [our GitHub Action](./github-action.yml).

Typically, all you need to do is run `node --test` in CI with Node 22. This will use Node's built-in test runner to find all files matching `.test.js` and run them.

You can also add this to your `package.json`:

```jsonc
{
  // ...snip...
  "scripts": {
    "test": "node --test"
  }
}
```
