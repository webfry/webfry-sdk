# Security Policy

## Reporting

Report vulnerabilities privately to:
- support@webfry.dev

Include:
- SDK version
- impact and exploitability
- reproduction steps

## Scope

This repo handles client-side request construction and response parsing for WebFry API.

Out of scope:
- vulnerabilities only present in user applications
- vulnerabilities in third-party tooling not invoked by this SDK

## Key Handling Guidance

- Never commit API keys.
- Do not ship keys in frontend bundles.
- Prefer server-side usage for production.
