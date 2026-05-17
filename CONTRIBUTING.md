# Contributing to KisanAI 🌾

Thank you for your interest in contributing to KisanAI! We're excited to have you join our community of developers, designers, and farmers who are making a difference in Indian agriculture.

This guide will help you understand our contribution process and get you started making your first contribution.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Coding Standards](#coding-standards)
9. [Testing Guidelines](#testing-guidelines)
10. [Getting Help](#getting-help)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

**Key Points:**
- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Report inappropriate behavior to maintainers

---

## 🚀 Getting Started

### Prerequisites

Before you start, ensure you have:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **GitHub Account** ([Create here](https://github.com/join))
- **A Code Editor** (VS Code recommended)

### First Time Setup

1. **Fork the Repository**
  - Click "Fork" on [KisanAI GitHub](https://github.com/asheesh109/KisanAI)
   - This creates a copy under your account

2. **Clone Your Fork**
  ```bash
  git clone https://github.com/asheesh109/KisanAI.git
  cd KisanAI
  ```

3. **Add Upstream Remote**
  ```bash
  git remote add upstream https://github.com/asheesh109/KisanAI.git
   git remote -v  # Verify both origin and upstream
   ```

4. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 🛠️ Development Setup

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your API keys to .env.local
# See docs/SETUP.md for details
```

### Running the Project

```bash
# Development server (with turbopack)
npm run dev

# Open http://localhost:3000
```

### Verify Setup

```bash
# Run linter
npm run lint

# Run tests
npm test

# Build project
npm run build
```

**[Detailed Setup Guide](./docs/SETUP.md)**

---

## 📝 Making Changes

### Finding Issues to Work On

#### For Beginners 👶
- Look for **[`good first issue`](https://github.com/asheesh109/KisanAI/labels/good%20first%20issue)** label
- These are specifically designed for new contributors
- **Estimated time**: 30 minutes - 2 hours
- **Perfect for**: Learning the codebase

#### For Intermediate Contributors 👨‍💻
- Look for **[`intermediate`](https://github.com/yourusername/KisanAI/labels/intermediate)** label
- These require understanding of project structure
- **Estimated time**: 2-8 hours
- **Perfect for**: Building features, fixing bugs

#### For Advanced Contributors 👨‍🎓
- Look for **[`advanced`](https://github.com/yourusername/KisanAI/labels/advanced)** label
- These involve architectural decisions
- **Estimated time**: 8+ hours
- **Perfect for**: Architecture, optimization, integration

### Issue Categories

| Category | Purpose | Example |
|----------|---------|---------|
| **Bug** | Fix broken functionality | Voice not working in Safari |
| **Feature** | Add new capability | Add dark mode support |
| **Enhancement** | Improve existing feature | Faster image upload |
| **Documentation** | Improve docs | Update API guide |
| **Performance** | Optimize code | Reduce bundle size |
| **Accessibility** | Improve a11y | Add ARIA labels |
| **Testing** | Add test coverage | Add component tests |
| **Refactor** | Improve code quality | Reorganize folder structure |

### Claiming an Issue

1. **Comment on the issue**: "I'd like to work on this"
2. **Wait for assignment**: Maintainer will assign it
3. **Start working**: Create feature branch for that issue
4. **Keep updated**: Comment with progress updates

---

## 💻 Submitting Changes

### Step 1: Make Your Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Edit files, add features, fix bugs

# Check what changed
git status
```

### Step 2: Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage

# Lint your code
npm run lint

# Build the project
npm run build
```

### Step 3: Commit Your Changes

**Follow our commit conventions:**

```
type(scope): short description

Longer explanation if needed.

Fixes #123
```

#### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation change
- **style**: Code style (formatting)
- **refactor**: Code refactoring
- **perf**: Performance improvement
- **test**: Adding/updating tests
- **chore**: Tooling/deps update

#### Examples
```bash
git add .
git commit -m "feat(voice-assistant): add hindi language support"
git commit -m "fix(crop-analysis): handle large image uploads"
git commit -m "docs: update setup guide"
```

### Step 4: Keep Your Branch Updated

```bash
# Fetch latest changes
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# If there are conflicts, resolve them
# Then continue rebase
git add .
git rebase --continue
```

### Step 5: Push Your Changes

```bash
# Push to your fork
git push origin feature/your-feature-name

# For subsequent pushes after rebase
git push origin feature/your-feature-name --force-with-lease
```

---

## 🔧 Commit Guidelines

### Good Commits ✅

```
# Clear, descriptive messages
git commit -m "feat(weather): add rainfall alerts

- Added AlertService class
- Implemented email notifications
- Added 85% test coverage

Fixes #456"
```

### Commit Best Practices

1. **One logical change per commit**
2. **Clear, descriptive messages**
3. **Reference related issues**
4. **Keep history clean**
5. **Test before committing**

### Squashing Commits

If you have many commits, squash them:

```bash
git rebase -i upstream/main

# Mark first as 'pick', rest as 'squash'
# Edit commit message
```

---

## 🔄 Pull Request Process

### Before Creating PR

- [ ] Code follows [Coding Standards](#coding-standards)
- [ ] Added/updated tests
- [ ] All tests pass: `npm test`
- [ ] Linter passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Updated relevant documentation
- [ ] Rebased on latest main branch

### Creating a Pull Request

1. **Go to GitHub**: [KisanAI Repository](https://github.com/asheesh109/KisanAI)

2. **Click "New Pull Request"**

3. **Select Your Branch**
   - Base: `main`
   - Compare: `your-feature-branch`

4. **Fill PR Template**

```markdown
## 📝 Description
Brief explanation of changes.

## 🔗 Related Issues
Closes #123

## 🎯 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## ✅ Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Cross-browser tested

## 📸 Screenshots (if applicable)
Before/after screenshots

## 🧪 Test Instructions
Steps to test this PR

## ✨ Additional Notes
Any important information
```

### PR Reviews

**What to expect:**
- Code review within 24-48 hours
- Feedback on code quality, testing, docs
- Constructive suggestions for improvement
- Approval and merge when ready

**Tips:**
- Be responsive to feedback
- Ask clarifying questions
- Request re-review after changes
- Be patient with review process

### Common Feedback

**"Add tests"**
```bash
# Example test file
src/__tests__/hooks/useVoiceAssistant.test.js
```

**"Update documentation"**
- Update relevant docs in `docs/`
- Update code comments
- Update API documentation

**"Follow coding standards"**
- See [Coding Standards](#coding-standards)
- Check [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)

---

## 📖 Coding Standards

### TypeScript

```typescript
// ✅ Good: Clear types, descriptive names
interface CropDiseaseAnalysis {
  diseaseId: string;
  diseaseName: string;
  confidence: number;
  treatment: TreatmentRecommendation[];
  preventionTips: string[];
}

const analyzeCropDisease = (imageFile: File): Promise<CropDiseaseAnalysis> => {
  // Implementation
};

// ❌ Bad: Unclear, missing types
const analyze = (file: any) => {
  // Implementation
};
```

### React Components

```typescript
// ✅ Good: Functional component with proper types
interface WeatherWidgetProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  location,
  onLocationChange,
}) => {
  return <div>Weather for {location}</div>;
};

// ❌ Bad: Unclear structure
const WeatherWidget = (props) => {
  return <div>{props.location}</div>;
};
```

### Naming Conventions

```typescript
// ✅ Good naming
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // Constants: UPPER_CASE
const userPreferences = {}; // Variables: camelCase
const fetchWeatherData = () => {}; // Functions: camelCase
const WeatherCard = () => {}; // Components: PascalCase
interface UserProfile {} // Interfaces: PascalCase
type Coordinates = [number, number]; // Types: PascalCase
```

### File Organization

```
src/
├── app/weather/
│   ├── page.jsx
│   ├── layout.jsx
│   └── __tests__/
│       └── WeatherPage.test.jsx
├── components/Weather/
│   ├── WeatherWidget.tsx
│   ├── WeatherCard.tsx
│   └── __tests__/
│       ├── WeatherWidget.test.tsx
│       └── WeatherCard.test.tsx
├── hooks/
│   ├── useWeather.ts
│   └── __tests__/
│       └── useWeather.test.ts
```

### Comments & Documentation

```typescript
// ✅ Good: Explains why, not what
// Limit image size to prevent memory issues on mobile devices
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Analyzes crop disease from image using Gemini Vision API
 * @param imageFile - Image file to analyze
 * @returns Promise with disease analysis results
 * @throws {Error} If image analysis fails
 */
const analyzeCropDisease = async (imageFile: File): Promise<DiseaseAnalysis> => {
  // Implementation
};

// ❌ Bad: Obvious from code
const MAX_SIZE = 5242880; // max image size
```

### Error Handling

```typescript
// ✅ Good: Specific error handling
try {
  const result = await analyzeImage(imageFile);
  return result;
} catch (error) {
  if (error instanceof FileSizeError) {
    throw new AppError('Image file is too large', 'INVALID_FILE_SIZE');
  }
  if (error instanceof NetworkError) {
    throw new AppError('Network error. Please try again.', 'NETWORK_ERROR');
  }
  throw error;
}

// ❌ Bad: Swallow errors
try {
  const result = await analyzeImage(imageFile);
  return result;
} catch {
  return null;
}
```

**[Full Coding Standards Guide](./docs/CODING_STANDARDS.md)**

---

## 🧪 Testing Guidelines

### Write Tests For

- ✅ New features
- ✅ Bug fixes
- ✅ Public functions
- ✅ Complex logic
- ✅ Edge cases

### Don't Over-Test

- ❌ Third-party libraries
- ❌ Simple getter/setter methods
- ❌ CSS-only changes
- ❌ Comments

### Example Test

```typescript
import { renderHook, act } from '@testing-library/react';
import { useWeather } from '@/hooks/useWeather';

describe('useWeather Hook', () => {
  it('should fetch weather for given location', async () => {
    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetchWeather('Mumbai');
    });

    // Assert weather data is loaded
    expect(result.current.weather).toBeDefined();
    expect(result.current.weather.location).toBe('Mumbai');
  });

  it('should handle network errors gracefully', async () => {
    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetchWeather('InvalidLocation');
    });

    expect(result.current.error).toBeDefined();
  });
});
```

**[Testing Guide](./docs/TESTING.md)**

---

## ✅ Pre-Submission Checklist

Before submitting your PR:

```
Code Quality
- [ ] Code follows coding standards
- [ ] No console.log statements (except errors)
- [ ] No commented-out code
- [ ] Variable names are clear and descriptive
- [ ] Functions are small and focused

Testing
- [ ] Added tests for new features
- [ ] Updated tests for modified features
- [ ] All tests pass locally
- [ ] Test coverage maintained or improved
- [ ] Tested edge cases

Documentation
- [ ] Updated README if needed
- [ ] Updated API docs if needed
- [ ] Added code comments for complex logic
- [ ] Updated CHANGELOG.md
- [ ] Added TypeScript types

Git & GitHub
- [ ] Branch rebased on latest main
- [ ] Commits are clean and descriptive
- [ ] PR description is clear
- [ ] Related issues are linked
- [ ] No merge conflicts

Browser & Responsiveness
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile (768px)
- [ ] Tested offline (if applicable)
- [ ] No console errors/warnings
```

---

## Branch Naming Conventions

Follow a predictable branch naming scheme so reviewers can quickly understand the intent.

- `feat/<short-description>` — new features
- `fix/<short-description>` — bug fixes
- `chore/<short-description>` — tooling or maintenance
- `docs/<short-description>` — documentation-only changes
- `test/<short-description>` — tests

Keep branch names lowercase, use hyphens, and keep them short (<= 40 chars).

## Commit Message Conventions

We follow conventional-style commit messages for clarity:

```
type(scope): short summary

Longer description (optional).

Closes #<issue-number>
```

- `type`: feat, fix, docs, style, refactor, perf, test, chore
- `scope`: optional, e.g., `voice-assistant` or `schemes`

Example:
```
feat(schemes): add eligibility filter

Adds server-side filter and UI to narrow schemes by role.

Closes #123
```

## PR Review Flow

1. Open PR and select appropriate reviewers (maintainers or assigned reviewer).
2. Ensure the PR description includes: summary, related issues, test instructions, and screenshots if UI changes.
3. Maintainers request changes or approve within 24-72 hours.
4. Address review comments in the same branch and push updates.
5. When approved, a maintainer will merge (often using `squash and merge`).

Notes:
- Be responsive to review comments and ask questions if unclear.
- Small fixup commits are okay; maintainers may squash during merge.

## Issue Claiming Workflow

1. Comment on the issue: "I'd like to work on this".
2. Wait for a maintainer to assign the issue (or assign yourself if labeled `good first issue` and unassigned for >48 hours).
3. Create a branch following branch naming conventions.
4. Post a short plan in the issue comment if the work is non-trivial.
5. Push progress updates to the issue periodically.

If you need help, leave a comment tagging `@asheesh109` and describe blockers — maintainers will help triage and unblock.

## Code Style Expectations

- Use TypeScript types where available and prefer typed exports for library code.
- Prefer descriptive variable names and small functions.
- Run linting and formatting before opening PRs. Use the project's ESLint/Prettier rules.
- Keep PRs focused: one logical change per PR.

## Communication Guidelines

- Be respectful and succinct in issue and PR comments.
- Use GitHub Discussions for open-ended questions and design conversations.
- For urgent security issues, email `ashishparab03@gmail.com` instead of opening public issues.
- If you're running into a blocker, state steps you've tried and environment details.

## Beginner Contribution Steps (Quick Start)

1. Find a `good first issue` in `ISSUE_BANK.md` or label search.
2. Comment to claim it and create your branch.
3. Make a small, well-scoped change and add/update tests if applicable.
4. Run lint and tests locally (see `CONTRIBUTING.md` testing snippets).
5. Push your branch and open a PR with the template filled.

## First PR Walkthrough

1. Fork and clone the repository.
2. Create a branch: `git checkout -b feat/my-first-change`.
3. Make changes and commit following commit conventions.
4. Run `npm test` and `npm run lint` locally.
5. Push and open a PR; in the description include: what you changed, why, and testing steps.
6. Link the PR to the issue: `Closes #<issue-number>`.
7. Address reviewer comments and iterate until approved.

## Onboarding Checklist (for first-time contributors)

- [ ] Fork the repo on GitHub
- [ ] Clone your fork locally
- [ ] Add upstream remote
- [ ] Create a branch using conventions
- [ ] Claim an issue and post a short plan
- [ ] Implement changes and add tests/docs
- [ ] Run lint and tests locally
- [ ] Open a PR and request review

---

## 🆘 Getting Help

### Documentation
- 📖 [SETUP.md](./docs/SETUP.md) - Setup instructions
- 📖 [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design
- 📖 [CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) - Code style
- 📖 [API.md](./docs/API.md) - API documentation

### Community
- 💬 [GitHub Discussions](https://github.com/yourusername/KisanAI/discussions)
- 🐛 [GitHub Issues](https://github.com/yourusername/KisanAI/issues)
- 📧 [Email](mailto:support@kisanai.example.com)
- 🤖 [Discord Community](https://discord.gg/kisanai)

### Common Issues

**"My branch has conflicts"**
```bash
git fetch upstream
git rebase upstream/main
# Resolve conflicts in your editor
git add .
git rebase --continue
```

**"Tests are failing"**
```bash
npm test -- --verbose
# Check error messages
# Debug using your IDE
```

**"Linter errors"**
```bash
npm run lint -- --fix
# Auto-fixes most issues
```

---

## 🎓 Learning Resources

### Git & GitHub
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-The-Basics)
- [GitHub Fork Workflow](https://guides.github.com/activities/forking/)
- [Understanding Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)

### Next.js & React
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Testing
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

### Tailwind CSS
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 🏆 Recognition

### Contributor Levels

| Level | Criteria | Benefits |
|-------|----------|----------|
| **Contributor** | 1+ merged PR | Listed in README |
| **Regular** | 5+ merged PRs | GitHub profile feature |
| **Maintainer** | 20+ merged PRs | Core team member |

### Badges

- 🎖️ GSSoC Contributor Badge
- 🎃 Hacktoberfest Shirt Qualifier
- ⭐ Community Star

---

## 📊 Contribution Types

We value all contributions, not just code:

- 💻 **Code** - Features, bug fixes, refactoring
- 📖 **Documentation** - Guides, examples, API docs
- 🐛 **Testing** - Tests, bug reports, QA
- 🎨 **Design** - UI improvements, mockups
- 🌐 **Translation** - Hindi, other languages
- 👥 **Community** - Help others, answer questions
- 💡 **Ideas** - Feature suggestions, improvements

---

## 📅 Development Timeline

- **Monday-Friday**: Active review and merging
- **Weekends**: Community discussions
- **Monthly**: Release cycle
- **Quarterly**: Major features

---

## 🚀 Becoming a Maintainer

We're always looking for experienced contributors to join our core team!

**Requirements:**
- 20+ merged PRs
- 3+ months contribution history
- Strong understanding of codebase
- Community support

**Responsibilities:**
- Review and merge PRs
- Mentor new contributors
- Maintain code quality
- Plan releases

**Benefits:**
- Direct influence on project direction
- Voting rights on decisions
- Maintainer recognition
- Community leadership role

Interested? Reach out to [@yourusername](https://github.com/yourusername) on GitHub!

---

## 📝 License

By contributing to KisanAI, you agree that your contributions will be licensed under its MIT License.

---

<div align="center">

### Thank you for contributing to KisanAI! 🙏

Your contributions help empower Indian farmers with AI-powered intelligence.

[← Back to README](./README.md)

</div>
