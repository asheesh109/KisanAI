# Pull Request Workflow

Follow this checklist when opening a PR:

- [ ] Link the issue using `Closes #<issue>` if applicable
- [ ] Describe the change and motivation in the PR body
- [ ] Run `npm run lint` and `npm run type-check`
- [ ] Add or update tests and ensure they pass (`npm test`)
- [ ] Include screenshots or recordings for UI changes
- [ ] Tag reviewers and mention breaking changes if any

CI checks run automatically on each PR (lint, type-check, tests, build).

Merge policy:
- Require 2 maintainer approvals
- All checks must pass
- Squash and merge commits
