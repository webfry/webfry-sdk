import { WebfryClient } from "webfry-sdk";

const client = new WebfryClient({
  baseUrl: process.env.WEBFRY_BASE_URL ?? "https://webfry.dev",
  apiKey: process.env.WEBFRY_API_KEY,
});

const info = await client.userInfo();
console.log("Plan:", info.plan, "Usage:", info.api_usage);

const strength = await client.passwordCheck({ password: "MyPassword123!" });
console.log(strength);
