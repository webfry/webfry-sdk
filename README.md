# webfry-sdk

Official JavaScript/TypeScript SDK for the [WebFry API](https://webfry.dev/api-docs).

## Install

```bash
npm install webfry-sdk
```

## Requirements
- Node.js 18+

## Quick Start

```ts
import { WebfryClient } from "webfry-sdk";

const client = new WebfryClient({
  baseUrl: "https://webfry.dev",
  apiKey: process.env.WEBFRY_API_KEY,
});

const info = await client.userInfo();
console.log(info.plan, info.api_usage);
```

## Authentication

Most endpoints require `X-API-Key`.

```ts
const client = new WebfryClient({ baseUrl: "https://webfry.dev" });
const { api_key } = await client.getApiKey({ email, password });
client.setApiKey(api_key);
```

## Plan Model (Current Stage)

UI naming:
- Starter Plan
- Pro Plan
- Enterprise Plan (upcoming)

Internal API plan values in responses:
- `free` -> Starter
- `premium` -> Pro

Starter limit is currently **100 requests/month**.

## Error Handling

SDK throws `WebfryApiError` for non-2xx responses.

```ts
import { WebfryClient, WebfryApiError } from "webfry-sdk";

try {
  await client.passwordCheck({ password: "test" });
} catch (err) {
  if (err instanceof WebfryApiError) {
    console.error(err.status, err.message, err.payload);
  }
}
```

## Constructor Options

```ts
new WebfryClient({
  baseUrl: "https://webfry.dev", // default
  apiKey: "wf_...",              // optional
  timeoutMs: 15000,               // default 15s
  fetchImpl: fetch                // optional custom fetch
});
```

## Methods

### Auth
- `getApiKey({ email, password })`
- `rotateApiKey()`
- `userInfo()`
- `setApiKey(apiKey)`
- `clearApiKey()`

### Password
- `passwordCheck({ password })`
- `commonPassword({ password })`
- `entropy({ password })`

### Hash
- `hashLookup({ hashes })`
- `hashLookupSite({ hashes })`
- `hashGenerator({ algorithm, plaintext })`
- `hashIdentifier({ hash })`

### Tools
- `base64({ text, option: "encode" | "decode" })`
- `generateRandomKey()`
- `jwtDecoder({ token })`
- `secureEncrypt({ text, password })`
- `secureDecrypt({ text, password })`
- `jsonFormat({ text })`
- `jsonMinify({ text })`
- `suggestion({ message, email? })`

### Construction-gated endpoints
- `ipInfo({ ip_string })`
- `dataBreach({ ip_string })`

These endpoints currently depend on backend release gating and may return construction messages.

## Examples
- `examples/get-key.mjs`
- `examples/node-basic.mjs`

## Development

```bash
npm install
npm run build
```

## Security

- Do not expose your API key in browser bundles.
- Use server-side execution for sensitive workflows.
- Rotate leaked keys immediately.

## Links
- API Docs: https://webfry.dev/api-docs
- OpenAPI: https://webfry.dev/docs_static/openapi.yaml
