# Contributing

## Setup

```bash
npm install
npm run build
```

## Development Rules
- Keep runtime dependency surface minimal.
- Maintain backwards compatibility for public method signatures.
- Reflect API changes in `README.md` and examples.
- Keep TypeScript types strict and explicit.

## Pull Request Checklist
- [ ] Build passes (`npm run build`)
- [ ] Public API changes documented in `README.md`
- [ ] If behavior changed, update examples
- [ ] Add changelog entry

## Versioning
Use semver:
- `patch`: bug fixes
- `minor`: additive methods/options
- `major`: breaking method/type changes
