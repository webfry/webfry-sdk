# Releasing

1. Update `CHANGELOG.md`.
2. Bump `package.json` version.
3. Build:
   ```bash
   npm ci
   npm run build
   ```
4. Dry-run package:
   ```bash
   npm pack --dry-run
   ```
5. Publish:
   ```bash
   npm publish --access public
   ```
