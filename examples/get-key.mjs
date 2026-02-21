import { WebfryClient } from "webfry-sdk";

const client = new WebfryClient({
  baseUrl: process.env.WEBFRY_BASE_URL ?? "https://webfry.dev",
});

const key = await client.getApiKey({
  email: process.env.WEBFRY_EMAIL ?? "",
  password: process.env.WEBFRY_PASSWORD ?? "",
});

console.log(key.api_key);
