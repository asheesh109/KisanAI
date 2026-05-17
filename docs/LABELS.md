# GitHub Labels System 🏷️

Complete documentation of all GitHub labels used in KisanAI for organization and filtering.

---

## 📋 How to Use Labels

1. **Create labels** in GitHub Settings → Labels
2. **Apply labels** when creating/triaging issues
3. **Filter issues** by labels when searching
4. **Use labels** in PR descriptions

---

## 🟢 Difficulty Level Labels

### good-first-issue
- **Color**: `#7057ff` (Blue)
- **Description**: Perfect for first-time contributors
- **Usage**: Issues designed for complete beginners
- **Effort**: 1-3 hours
- **Count**: 40+ issues

### beginner-friendly
- **Color**: `#51dd98` (Green)
- **Description**: Good for developers learning the codebase
- **Usage**: Issues that teach codebase patterns
- **Effort**: 2-5 hours
- **Count**: 30+ issues

### intermediate
- **Color**: `#ffb8c5` (Pink)
- **Description**: Requires understanding of architecture
- **Usage**: Feature implementations, optimizations
- **Effort**: 4-8 hours
- **Count**: 25+ issues

### advanced
- **Color**: `#d93f0b` (Red)
- **Description**: Requires expertise in domain
- **Usage**: Complex features, architecture changes
- **Effort**: 8+ hours
- **Count**: 15+ issues

---

## 🎯 Category Labels

### frontend
- **Color**: `#0052cc` (Blue)
- **Description**: UI/UX and React component work
- **Issues**: Component creation, styling, interactions
- **Team**: Frontend developers

### backend
- **Color**: `#0e8a16` (Green)
- **Description**: API routes, services, business logic
- **Issues**: API development, database interactions
- **Team**: Backend developers

### documentation
- **Color**: `#d4c5f9` (Purple)
- **Description**: Documentation and guides
- **Issues**: README updates, guides, API docs
- **Team**: Technical writers, all contributors

### testing
- **Color**: `#fbca04` (Yellow)
- **Description**: Test coverage and QA
- **Issues**: Unit tests, integration tests, test fixes
- **Team**: QA, all contributors

### database
- **Color**: `#1d76db` (Blue)
- **Description**: MongoDB and data layer
- **Issues**: Schema design, migrations, queries
- **Team**: Backend developers

### devops
- **Color**: `#e11d21` (Red)
- **Description**: Infrastructure and deployment
- **Issues**: CI/CD, Docker, Kubernetes, monitoring
- **Team**: DevOps, infrastructure team

### ai
- **Color**: `#fc2929` (Red)
- **Description**: AI/ML features and integration
- **Issues**: Gemini integration, ML models, predictions
- **Team**: AI/ML specialists, advanced developers

---

## 📋 Feature Labels

### voice
- **Color**: `#1f6feb` (Blue)
- **Description**: Voice assistant feature
- **Issues**: Speech recognition, synthesis, chat
- **Related**: `frontend`, `backend`, `ai`

### crops
- **Color**: `#91ca55` (Green)
- **Description**: Crop analysis feature
- **Issues**: Image analysis, disease detection
- **Related**: `frontend`, `backend`, `ai`

### weather
- **Color**: `#a2eeef` (Light Blue)
- **Description**: Weather forecasting feature
- **Issues**: Weather data, forecasts, alerts
- **Related**: `frontend`, `backend`

### markets
- **Color**: `#f0883e` (Orange)
- **Description**: Market prices feature
- **Issues**: Price tracking, trends, alerts
- **Related**: `frontend`, `backend`

### schemes
- **Color**: `#0075ca` (Blue)
- **Description**: Government schemes feature
- **Issues**: Scheme portal, eligibility checker
- **Related**: `frontend`, `backend`

---

## 🎨 Type Labels

### bug
- **Color**: `#d73a4a` (Red)
- **Description**: Something isn't working correctly
- **SLA**: 24-48 hours response
- **Priority**: High

### enhancement
- **Color**: `#a2eeef` (Light Blue)
- **Description**: New feature or improvement
- **SLA**: 48-72 hours response
- **Priority**: Medium

### feature
- **Color**: `#0366d6` (Blue)
- **Description**: New functionality request
- **SLA**: 48-72 hours response
- **Priority**: Medium

### refactor
- **Color**: `#ffd700` (Gold)
- **Description**: Code quality improvement
- **SLA**: 1-2 weeks
- **Priority**: Low-Medium

### performance
- **Color**: `#f29513` (Orange)
- **Description**: Speed or efficiency improvement
- **SLA**: 1 week
- **Priority**: Medium

### security
- **Color**: `#ee0701` (Red)
- **Description**: Security vulnerability or improvement
- **SLA**: 24 hours
- **Priority**: Critical

### accessibility
- **Color**: `#0075ca` (Blue)
- **Description**: A11y improvements
- **SLA**: 1 week
- **Priority**: Medium

---

## 🔍 Status Labels

### triage
- **Color**: `#cccccc` (Gray)
- **Description**: Needs review and categorization
- **Action**: Maintainer will review and add category labels

### help-wanted
- **Color**: `#008672` (Teal)
- **Description**: Extra attention is needed
- **Action**: Experienced contributors encouraged

### good-candidates-for-review
- **Color**: `#bfdadc` (Light Blue)
- **Description**: Ready for peer review
- **Action**: Reviewers should check these PRs

### blocked
- **Color**: `#ee0701` (Red)
- **Description**: Cannot progress (waiting on something)
- **Action**: Unblock by addressing blocker

### in-progress
- **Color**: `#e2be00` (Yellow)
- **Description**: Someone is actively working on it
- **Action**: Comment if interested in helping

### ready-to-merge
- **Color**: `#00b43e` (Green)
- **Description**: Approved, waiting for merge
- **Action**: Core maintainer to merge

### wont-fix
- **Color**: `#ffffff` (White)
- **Description**: Will not be implemented
- **Action**: Update issue with explanation

### duplicate
- **Color**: `#cfd3d7` (Gray)
- **Description**: Already reported or implemented
- **Action**: Link to original issue

### invalid
- **Color**: `#f9ca24` (Yellow)
- **Description**: Not a valid issue or PR
- **Action**: Explain why in comment

---

## 🎯 Priority Labels

### high-priority
- **Color**: `#ee0701` (Red)
- **Description**: Should be done ASAP
- **SLA**: 24-48 hours
- **Effort**: High
- **Compensation**: Higher bounty (if applicable)

### medium-priority
- **Color**: `#f29513` (Orange)
- **Description**: Important but not urgent
- **SLA**: 1 week
- **Effort**: Medium
- **Compensation**: Standard bounty

### low-priority
- **Color**: `#0075ca` (Blue)
- **Description**: Nice to have, can wait
- **SLA**: 2+ weeks
- **Effort**: Variable
- **Compensation**: Lower bounty

---

## 🌍 Language & Community Labels

### i18n
- **Color**: `#0052cc` (Blue)
- **Description**: Internationalization (multi-language)
- **Issues**: Hindi support, translation, locale
- **Team**: i18n specialists

### hacktoberfest
- **Color**: `#f29513` (Orange)
- **Description**: Hacktoberfest-eligible issue
- **Eligibility**: Beginner to intermediate difficulty
- **Impact**: High-impact, achievable in October

### gssoc-2025
- **Color**: `#ff6b6b` (Red)
- **Description**: GSSoC 2025 eligible issue
- **Eligibility**: Good first issue to intermediate
- **Impact**: Aligned with GSSoC goals

### community
- **Color**: `#0366d6` (Blue)
- **Description**: Community-driven initiative
- **Issues**: Community events, discussions
- **Team**: All contributors

---

## 🏆 Special Labels

### mentor-available
- **Color**: `#02d7e1` (Cyan)
- **Description**: Mentor assigned to help
- **Benefit**: Free guidance and mentorship
- **Ideal for**: First-time contributors

### first-timers-only
- **Color**: `#7057ff` (Blue)
- **Description**: For first-time GitHub contributors
- **Restriction**: Only newcomers should claim
- **Purpose**: Lower barrier to entry

### no-coding
- **Color**: `#d4c5f9` (Purple)
- **Description**: Non-coding contribution needed
- **Examples**: Writing, design, research
- **Team**: Everyone (not just developers)

### good-candidates-for-automation
- **Color**: `#bfdadc` (Light Blue)
- **Description**: Can be automated
- **Team**: DevOps, automation specialists

---

## 📊 Label Statistics

| Category | Count | Example Labels |
|----------|-------|-----------------|
| Difficulty | 4 | `good-first-issue`, `beginner-friendly`, `intermediate`, `advanced` |
| Type | 8 | `bug`, `feature`, `enhancement`, `documentation` |
| Feature | 5 | `voice`, `crops`, `weather`, `markets`, `schemes` |
| Category | 7 | `frontend`, `backend`, `testing`, `database`, `devops`, `ai` |
| Status | 10 | `triage`, `in-progress`, `blocked`, `ready-to-merge` |
| Priority | 3 | `high-priority`, `medium-priority`, `low-priority` |
| Special | 4 | `hacktoberfest`, `gssoc-2025`, `mentor-available`, `no-coding` |
| **TOTAL** | **41** | Comprehensive labeling system |

---

## 🔄 Labeling Workflow

### When Creating Issues

```mermaid
Issue Created
  ↓
Add Difficulty Label (good-first-issue / beginner-friendly / intermediate / advanced)
  ↓
Add Type Label (bug / feature / enhancement / documentation)
  ↓
Add Category Label (frontend / backend / testing / etc.)
  ↓
Add Feature Label (if applicable - voice / crops / weather / etc.)
  ↓
If no immediate work: Add 'help-wanted'
  ↓
If urgent: Add 'high-priority'
  ↓
Ready for Contributors
```

### When Reviewing PRs

```mermaid
PR Submitted
  ↓
Review Code
  ↓
If Approved: Add 'good-candidates-for-review'
  ↓
Merge & Add 'ready-to-merge'
  ↓
After Merge: Remove status labels
  ↓
Add 'mentor-available' for complex PRs
  ↓
Celebrate Contribution!
```

---

## 🎓 Label Best Practices

### Do
✅ Use consistent label naming
✅ Add multiple labels to an issue
✅ Update labels during issue lifecycle
✅ Use labels for filtering and organization
✅ Document what each label means

### Don't
❌ Create too many niche labels
❌ Use inconsistent colors
❌ Forget to add difficulty labels
❌ Leave issues without any labels
❌ Create misleading label descriptions

---

## 🔧 Setting Up Labels

### Script to Create Labels

```bash
# Run this to create all labels
npm run setup:labels

# Or manually create in GitHub Settings → Labels
```

### Bulk Label Management

Use GitHub CLI:

```bash
# Add label to issue
gh issue edit 123 -l "bug,high-priority"

# Add label to PR
gh pr edit 456 -l "documentation,ready-to-merge"

# View all labels
gh label list
```

---

## 📞 Questions About Labels?

- 💬 [GitHub Discussions](https://github.com/yourusername/KisanAI/discussions)
- 📧 [Email](mailto:labels@kisanai.example.com)

---

<div align="center">

### Help organize KisanAI! 🏷️

Use these labels to help contributors find work they care about.

[← Back to Documentation](./README.md)

</div>
