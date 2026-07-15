# 🌾 KisanAI — Event Contributor Guide

> **For GSSoC'26 & Hacktoberfest participants** — everything you need to make your best contribution.

Welcome! This guide is your single source of truth if you're contributing to KisanAI as part of **GirlScript Summer of Code (GSSoC)** or **Hacktoberfest**. Read it top-to-bottom at least once before opening your first PR.

---

## 📋 Table of Contents

1. [Quick-Start Checklist](#1-quick-start-checklist)
2. [GSSoC — Specific Guide](#2-gssoc--specific-guide)
3. [Hacktoberfest — Specific Guide](#3-hacktoberfest--specific-guide)
4. [Issue Selection Tips](#4-issue-selection-tips)
5. [Branch & Commit Standards](#5-branch--commit-standards)
6. [Pull Request Standards](#6-pull-request-standards)
7. [Label Mapping & Workflow](#7-label-mapping--workflow)
8. [Review Expectations](#8-review-expectations)
9. [Mentor Pairing Template](#9-mentor-pairing-template)
10. [FAQ](#10-faq)
11. [Contact & Support](#11-contact--support)

---

## 1. Quick-Start Checklist

Use this checklist **before you open any PR**. PRs that skip these steps will be asked to revise before review begins.

### 🔧 One-time Setup

- [ ] **Fork** the repository → [asheesh109/KisanAI](https://github.com/asheesh109/KisanAI)
- [ ] **Clone** your fork locally
  ```bash
  git clone https://github.com/<your-username>/KisanAI.git
  cd KisanAI
  ```
- [ ] **Add upstream remote** so you can stay in sync
  ```bash
  git remote add upstream https://github.com/asheesh109/KisanAI.git
  git remote -v   # should show both origin and upstream
  ```
- [ ] **Install dependencies**
  ```bash
  npm install
  ```
- [ ] **Copy environment file** and fill in required values
  ```bash
  cp .env.example .env.local
  ```
- [ ] **Run the dev server** and confirm everything works
  ```bash
  npm run dev
  ```
- [ ] **Read** [CONTRIBUTING.md](../CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)
- [ ] **Read** [docs/CODING_STANDARDS.md](./CODING_STANDARDS.md) for code style rules

---

### 📌 Per-Issue Checklist

- [ ] Issue exists and is **not already assigned** to someone else
- [ ] You have **commented on the issue** asking to be assigned (do not just open a PR)
- [ ] You understand the acceptance criteria stated in the issue
- [ ] You have synced your fork with upstream before starting
  ```bash
  git fetch upstream
  git checkout main
  git merge upstream/main
  ```
- [ ] You created a **correctly named branch** (see [Branch Standards](#5-branch--commit-standards))
- [ ] You have added the correct **event label** to your PR (`gssoc-2026` or `hacktoberfest`)

---

### ✅ Pre-PR Checklist

- [ ] Code compiles with **no TypeScript errors** (`npm run type-check`)
- [ ] All existing tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] New functionality includes **tests** (if applicable)
- [ ] Documentation is **updated** to reflect your change
- [ ] PR description follows the [PR template](#6-pull-request-standards)
- [ ] PR is **linked to the issue** (`Closes #<issue-number>` in description)
- [ ] PR is **not a draft** when submitted for review
- [ ] No unnecessary files (`.env.local`, `node_modules`, build artifacts) committed

---

## 2. GSSoC — Specific Guide

### What is GSSoC?

[GirlScript Summer of Code](https://www.girlscript.tech/home/gssoc) (GSSoC) is a 3-month open-source program where selected contributors work with mentored open-source projects. KisanAI is an official GSSoC'26 project.

### GSSoC Contribution Rules

| Rule | Detail |
|------|--------|
| **Claim first** | Always comment and get assigned before starting work |
| **One issue at a time** | Do not hold multiple issues without active progress |
| **Timely delivery** | Aim to submit PR within 3-5 days of claiming |
| **Quality over quantity** | One great PR beats five mediocre ones |
| **Respond to reviews** | Address review comments within 48 hours |
| **No duplicate work** | Check open PRs before starting |

### GSSoC Point System

Points are awarded by maintainers based on issue difficulty and PR quality:

| Difficulty Label | Approximate Points | Effort |
|------------------|--------------------|--------|
| `good-first-issue` | 10 pts | 1-3 hrs |
| `beginner-friendly` | 15 pts | 2-5 hrs |
| `intermediate` | 25 pts | 4-8 hrs |
| `advanced` | 40 pts | 8+ hrs |

> **Note:** Points are awarded at maintainer discretion based on actual PR quality. Gaming the system (low-effort PRs on high-point issues) results in disqualification.

### GSSoC Checklist

- [ ] You are registered as a GSSoC'26 contributor on the official portal
- [ ] Your GitHub profile has your full name visible
- [ ] You have starred the [KisanAI repository](https://github.com/asheesh109/KisanAI) ⭐
- [ ] You have followed [@asheesh109](https://github.com/asheesh109) on GitHub
- [ ] Your PR has the `gssoc-2026` label added (ask maintainer if you cannot add it)
- [ ] Your PR description mentions "GSSoC'26" in the **Program** field
- [ ] You have introduced yourself in GitHub Discussions
- [ ] If this is your first GSSoC PR, request a mentor (see [Mentor Pairing Template](#9-mentor-pairing-template))

### GSSoC Timeline Expectations

```
Week 1:   Setup, introduce yourself, claim your first issue
Week 2:   Submit first PR (documentation or good-first-issue)
Week 3+:  Graduate to beginner/intermediate issues
Month 2:  Take on intermediate/advanced issues with mentor support
Month 3:  Lead improvements, help review other PRs
```

---

## 3. Hacktoberfest — Specific Guide

### What is Hacktoberfest?

[Hacktoberfest](https://hacktoberfest.com/) is an annual October challenge where you submit **4 quality PRs** to open-source repositories to earn rewards. KisanAI fully supports Hacktoberfest participation.

### Hacktoberfest Rules for KisanAI

| Rule | Detail |
|------|--------|
| **Meaningful PRs only** | Trivial typo fixes, whitespace-only, or auto-generated PRs will be marked `spam` |
| **PR must solve an issue** | Link every PR to a GitHub issue, or open one first |
| **No mass formatting** | Do not reformat entire files just to get a PR count |
| **One PR per issue** | Do not split a single task into multiple tiny PRs |
| **10-day review window** | PRs must pass review within 10 days to count |

### What Makes a Valid Hacktoberfest PR?

**Valid contributions:**
- Bug fixes with test coverage
- New feature implementations linked to open issues
- Documentation improvements (must be substantial, not just typos)
- New test coverage for untested components
- Accessibility improvements
- i18n/translation additions
- Performance optimizations

**Invalid contributions (will be marked spam):**
- Only whitespace or formatting changes
- Trivial single-word changes
- Auto-generated content without understanding the codebase
- Duplicate of an existing PR
- PRs not linked to issues

### Hacktoberfest Checklist

- [ ] You have registered at [hacktoberfest.com](https://hacktoberfest.com/) with your GitHub account
- [ ] You have filtered issues by the `hacktoberfest` label: [View Issues](https://github.com/asheesh109/KisanAI/labels/hacktoberfest)
- [ ] Your PR has the `hacktoberfest` label (maintainer will add it on approval)
- [ ] Your PR description clearly states **what problem it solves**
- [ ] Your contribution is meaningful and not trivial
- [ ] You have reviewed the Spam PR Warning below

### Spam PR Warning

PRs flagged as `spam` or `invalid` by maintainers count against your Hacktoberfest progress. KisanAI maintainers will mark PRs as `spam` if they:

- Add no real value (e.g., adding a period, changing variable names randomly)
- Are clearly generated without understanding the code
- Duplicate a recently merged PR
- Violate our [Code of Conduct](../CODE_OF_CONDUCT.md)

---

## 4. Issue Selection Tips

### How to Find the Right Issue

1. **Visit the Issues tab** at [KisanAI Issues](https://github.com/asheesh109/KisanAI/issues)
2. **Filter by program label**: `gssoc-2026` or `hacktoberfest`
3. **Filter by difficulty**: Start with `good-first-issue` if you are new
4. **Check for assignment**: Issues with an assignee are taken — look for unassigned ones
5. **Read the full issue**: Understand acceptance criteria before claiming

### Issue Difficulty Guide

| Label | Time Estimate | Best For | Skills Needed |
|-------|--------------|----------|---------------|
| `good-first-issue` | 1-3 hours | First-timers | Basic Git, any language |
| `beginner-friendly` | 2-5 hours | After 1-2 contributions | Basic React/TS |
| `intermediate` | 4-8 hours | Comfortable with codebase | React, Next.js, API work |
| `advanced` | 8+ hours | Experienced contributors | Full-stack, Architecture |

### Issue Selection Do's and Don'ts

**Do:**
- Start with `good-first-issue` or `documentation` labeled issues
- Read linked issues/PRs to understand context
- Ask questions in the issue comments before starting if unclear
- Pick issues that match your current skill level

**Don't:**
- Claim issues you cannot deliver in 5 days without updating the maintainer
- Work on the same issue as someone already in progress (check recent comments)
- Pick `advanced` issues as your first contribution
- Claim multiple issues simultaneously without prior contributions

### How to Claim an Issue

Post the following comment on the issue you want to work on:

```
Hi @asheesh109! I'd like to work on this issue.

- Program: GSSoC'26 / Hacktoberfest [delete as appropriate]
- Experience level: Beginner / Intermediate / Advanced
- Estimated time to complete: X days
- Approach: [Brief description of how you plan to solve it]

Could you please assign this to me? Thank you!
```

---

## 5. Branch & Commit Standards

### Branch Naming Convention

Always create a new branch from the latest `main`:

```bash
git fetch upstream
git checkout -b <type>/<short-description> upstream/main
```

| Contribution Type | Branch Format | Example |
|-------------------|--------------|---------|
| New feature | `feat/<description>` | `feat/crop-calendar-view` |
| Bug fix | `fix/<description>` | `fix/voice-assistant-crash` |
| Documentation | `docs/<description>` | `docs/contributing-events-guide` |
| Tests | `test/<description>` | `test/market-api-coverage` |
| Refactor | `refactor/<description>` | `refactor/schemes-component` |
| Style/CSS | `style/<description>` | `style/dashboard-responsive` |
| CI/DevOps | `ci/<description>` | `ci/add-lint-workflow` |

> **Never commit directly to `main`**. Always work on a feature branch.

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body — explain WHY, not WHAT]

[optional footer — e.g., Closes #50]
```

**Types:**

| Type | When to use |
|------|-------------|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `docs` | Documentation-only changes |
| `style` | Formatting (no logic change) |
| `refactor` | Code restructuring |
| `test` | Adding or fixing tests |
| `chore` | Build process, dependency updates |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration |

**Good commit examples:**
```
docs(contributing): add GSSoC and Hacktoberfest event guide
feat(voice): add Hindi language toggle in voice assistant
fix(market): resolve price fetch error on slow connections
test(schemes): add unit tests for eligibility checker
```

**Bad commit examples:**
```
update file          <- too vague
fixed stuff          <- no type, vague
WIP                  <- never push WIP commits to PR
asdfgh               <- meaningless
```

---

## 6. Pull Request Standards

### PR Title Format

```
<type>(<scope>): <clear description> [closes #<issue-number>]
```

Examples:
- `docs(events): add GSSoC and Hacktoberfest contributor guide [closes #50]`
- `feat(crops): implement disease detection results page [closes #73]`
- `fix(auth): resolve login redirect loop on mobile [closes #88]`

### PR Description Template

When opening a PR, use this template (copy and fill in each section):

```markdown
## Summary

<!-- 1-3 sentences describing WHAT you changed and WHY -->

## Related Issue

Closes #<issue-number>

## Program

- [ ] GSSoC'26
- [ ] Hacktoberfest

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor
- [ ] Tests
- [ ] Style

## How to Test

<!-- Step-by-step instructions for reviewers to verify your change -->
1. 
2. 
3. 

## Screenshots / Demo

<!-- Add screenshots or screen recordings if UI was changed. Delete if N/A -->

## Pre-submission Checklist

- [ ] I have read CONTRIBUTING.md
- [ ] My code follows the project's CODING_STANDARDS.md
- [ ] I ran `npm run lint` and there are no errors
- [ ] I ran `npm run type-check` and there are no errors
- [ ] I ran `npm run test` and all tests pass
- [ ] I have added tests for new functionality (if applicable)
- [ ] I have updated documentation (if applicable)
- [ ] My commits follow the Conventional Commits format
- [ ] My branch is up-to-date with `upstream/main`

## Additional Notes

<!-- Anything else reviewers should know? Design decisions, trade-offs, future work? -->
```

### PR Size Guidelines

| PR Size | Files Changed | Lines Changed | Notes |
|---------|--------------|---------------|-------|
| Small | 1-5 | less than 100 | Ideal — quick to review |
| Medium | 5-15 | 100-500 | Acceptable for features |
| Large | 15-30 | 500-1000 | Request review split |
| XL | 30+ | 1000+ | Must be split into smaller PRs |

> **Tip:** Smaller PRs get reviewed faster. If your feature is large, split it into logical, independently reviewable chunks.

---

## 7. Label Mapping & Workflow

### Understanding Labels

Every issue and PR in KisanAI uses a structured label system. Here is what each category means and how to use it:

#### Difficulty Labels (applied to issues)

| Label | Color | Meaning | Who should pick it |
|-------|-------|---------|-------------------|
| `good-first-issue` | Purple | Safe for complete beginners | First-time contributors |
| `beginner-friendly` | Green | Requires basic codebase knowledge | After 1-2 PRs |
| `intermediate` | Pink | Needs familiarity with services | Comfortable contributors |
| `advanced` | Red | Architecture-level work | Experienced contributors |

#### Type Labels (applied to both issues and PRs)

| Label | When Applied |
|-------|-------------|
| `bug` | Something is broken |
| `enhancement` | Improving existing functionality |
| `feature` | Entirely new functionality |
| `documentation` | Docs-only changes |
| `testing` | Tests and QA |
| `refactor` | Code restructuring without behavior change |
| `accessibility` | A11y improvements |

#### Program Labels (applied to PRs and issues)

| Label | Program |
|-------|---------|
| `gssoc-2026` | GSSoC'26 eligible issue or PR |
| `hacktoberfest` | Hacktoberfest eligible issue or PR |

#### Status Labels (applied by maintainers)

| Label | Meaning | Action Needed |
|-------|---------|---------------|
| `triage` | Needs maintainer review | Wait for maintainer |
| `in-progress` | Actively being worked on | Do not duplicate |
| `help-wanted` | Needs contributor | Feel free to pick up! |
| `blocked` | Waiting on something | Comment to unblock |
| `ready-to-merge` | Approved and queued | No action needed |
| `needs-revision` | Changes requested | Address review comments |

#### Special Labels

| Label | Meaning |
|-------|---------|
| `mentor-available` | A mentor is assigned to help |
| `first-timers-only` | Reserved for contributors new to GitHub |
| `no-coding` | Documentation, design, or research only |
| `gssoc-mentor-request` | Add this to request a GSSoC mentor |

### Label Workflow Diagram

```
Issue Created by Maintainer
        |
        v
[Difficulty Label Added]
good-first-issue / beginner-friendly / intermediate / advanced
        |
        v
[Type Label Added]
bug / feature / documentation / testing / ...
        |
        v
[Program Label Added]
gssoc-2026 / hacktoberfest
        |
        v
[help-wanted] -- Contributor claims issue
        |
        v
[in-progress] -- Contributor opens PR
        |
        |--- Review comments ---> [needs-revision]
        |                              |
        |                              v
        |                       Contributor updates PR
        |                              |
        +------------------------------+
                                       v
                              [ready-to-merge]
                                       |
                                       v
                               PR Merged!
```

### How to Filter Issues by Label

```
GSSoC issues only:
https://github.com/asheesh109/KisanAI/issues?q=label%3Agssoc-2026+is%3Aopen

Hacktoberfest issues only:
https://github.com/asheesh109/KisanAI/issues?q=label%3Ahacktoberfest+is%3Aopen

Good first issues:
https://github.com/asheesh109/KisanAI/issues?q=label%3A%22good-first-issue%22+is%3Aopen

Help wanted:
https://github.com/asheesh109/KisanAI/issues?q=label%3A%22help-wanted%22+is%3Aopen
```

---

## 8. Review Expectations

### What Reviewers Look For

1. **Correctness** — Does the code solve the stated problem?
2. **Code quality** — Is it readable, maintainable, and idiomatic?
3. **Test coverage** — Are new code paths tested?
4. **Documentation** — Is the change documented where needed?
5. **Commit history** — Are commits atomic and well-described?
6. **PR scope** — Is the PR focused on one thing?

### Review Timeline

| Stage | Expected Time |
|-------|--------------|
| Initial review | 2-4 business days |
| Follow-up review (after revisions) | 1-2 business days |
| Merge after approval | Within 1 business day |

> If your PR has not received a review in 5 business days, ping `@asheesh109` in the PR comments (once, politely).

### Responding to Review Comments

- **Address every comment** — even if you disagree, respond to explain why
- **Do not push force-pushes** after requesting re-review (it hides diff history)
- **Mark conversations resolved** after addressing them
- **Ask for clarification** if a review comment is unclear
- Keep discussion professional and constructive

### Review Response Time Expectations (for contributors)

| Response Time | Status |
|--------------|--------|
| Less than 48 hours | Excellent |
| 48-96 hours | Acceptable |
| 4-7 days | Maintainer may ping you |
| More than 7 days | Issue may be unassigned, PR closed |

---

## 9. Mentor Pairing Template

### Who Needs a Mentor?

- First-time open source contributors
- Contributors who are stuck on an implementation
- GSSoC'26 participants working on `intermediate` or `advanced` issues
- Anyone who would like structured feedback

### How to Request a Mentor

**Step 1:** Add the label `gssoc-mentor-request` to your issue (ask maintainer if you cannot).

**Step 2:** Post the following comment on your issue:

```
## Mentor Pairing Request

Contributor Name: [Your name]
GitHub Handle: @your-username
Program: GSSoC'26 / Hacktoberfest [delete as appropriate]

Issue I am Working On: #<issue-number> — [Issue title]
Difficulty Level: good-first-issue / beginner / intermediate / advanced

My Current Understanding:
[What do you understand about the issue so far?]

Where I am Stuck / Need Help:
[Be specific — "I do not understand X" is more helpful than "I need help"]

What I Have Already Tried:
[List approaches you have already explored so mentor does not repeat suggestions]

My Availability (timezone + hours):
[E.g., IST, weekdays 7-9 PM]

Preferred Communication:
- [ ] GitHub Comments (recommended)
- [ ] Email
- [ ] Other: ___________

Thank you!
```

### Mentor Responsibilities

Mentors assigned to KisanAI issues will:

- Respond within 48 hours of a mentor request
- Provide an initial plan or direction within 3 days
- Review PR drafts and give structured feedback
- Help unblock contributors without giving away the full solution
- Point to relevant code/documentation to aid understanding

### Mentor Contact

| Role | Name | GitHub | Email |
|------|------|--------|-------|
| Primary Maintainer and Mentor | Ashish Parab | [@asheesh109](https://github.com/asheesh109) | ashishparab03@gmail.com |

> For sensitive matters (harassment, code of conduct violations), email directly at **ashishparab03@gmail.com** — do not post publicly.

---

## 10. FAQ

### General

**Q: Can I contribute without being registered in GSSoC or Hacktoberfest?**

Yes! All contributions are welcome. Event-specific labels and point tracking only apply to registered participants.

**Q: Can I work on multiple issues at once?**

As a beginner, please complete at least one PR before claiming a second issue. Experienced contributors may hold up to 2 issues simultaneously.

**Q: My PR was merged — where do I see my points/contribution logged?**

GSSoC points are managed by the GSSoC portal. Contributions are also visible on your GitHub profile and in our [Contributors graph](https://github.com/asheesh109/KisanAI/graphs/contributors).

**Q: The issue I wanted was just assigned to someone else. What do I do?**

Check for other similar issues, or ask in the comments if you can collaborate. Alternatively, look for other `help-wanted` issues.

---

### Technical

**Q: My `npm run lint` is failing on unrelated files. What do I do?**

Only fix lint errors in files you actually changed. If pre-existing lint errors are blocking you, mention it in your PR description.

**Q: My branch is behind `main`. How do I update it?**

```bash
git fetch upstream
git rebase upstream/main
```

**Q: I accidentally committed to `main`. How do I fix it?**

```bash
git checkout -b feat/my-fix   # create a new branch
git checkout main
git reset --hard upstream/main  # reset main (local only)
```

**Q: My PR has merge conflicts. What do I do?**

Resolve conflicts locally, commit the resolution, and push. Avoid using GitHub's web editor to resolve complex conflicts.

---

### Process

**Q: How long does it take to get a PR reviewed?**

Typically 2-4 business days. If it has been 5+ days, ping `@asheesh109` once in the PR comments.

**Q: Can I submit a PR without an issue?**

For bug fixes and documentation improvements, you can open both simultaneously. For features, always open an issue first and get maintainer approval.

**Q: What happens if I miss a deadline or go inactive?**

Comment on the issue explaining the delay. If there is no response for 7 days after a review request, the issue may be unassigned to allow others to contribute.

---

## 11. Contact & Support

### Primary Contact

| | |
|-|-|
| **Maintainer** | Ashish Parab |
| **GitHub** | [@asheesh109](https://github.com/asheesh109) |
| **Email** | [ashishparab03@gmail.com](mailto:ashishparab03@gmail.com) |

### Community Channels

| Channel | Purpose | Link |
|---------|---------|------|
| GitHub Issues | Report bugs, propose features | [Issues](https://github.com/asheesh109/KisanAI/issues) |
| GitHub Discussions | Ask questions, share ideas | [Discussions](https://github.com/asheesh109/KisanAI/discussions) |
| GitHub PRs | Submit contributions | [Pull Requests](https://github.com/asheesh109/KisanAI/pulls) |

### Useful Links

| Resource | Link |
|----------|------|
| Main Repository | [asheesh109/KisanAI](https://github.com/asheesh109/KisanAI) |
| CONTRIBUTING.md | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Code of Conduct | [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) |
| Coding Standards | [docs/CODING_STANDARDS.md](./CODING_STANDARDS.md) |
| Labels Guide | [docs/LABELS.md](./LABELS.md) |
| GSSoC Program | [girlscript.tech/gssoc](https://www.girlscript.tech/home/gssoc) |
| Hacktoberfest | [hacktoberfest.com](https://hacktoberfest.com/) |
| Good First Issues | [Filter by label](https://github.com/asheesh109/KisanAI/issues?q=label%3A%22good-first-issue%22+is%3Aopen) |
| Hacktoberfest Issues | [Filter by label](https://github.com/asheesh109/KisanAI/issues?q=label%3Ahacktoberfest+is%3Aopen) |

---

## Happy Contributing to KisanAI!

Every contribution, no matter how small, helps Indian farmers.
Thank you for being part of this mission.

[Back to CONTRIBUTING.md](../CONTRIBUTING.md) | [Back to docs/](./README.md)