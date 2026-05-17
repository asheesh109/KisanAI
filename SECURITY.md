# Security Policy

We take security seriously. If you discover a vulnerability, please follow these steps:

1. Do not create a public issue. Contact maintainers securely using `ashishparab03@gmail.com`.
2. Provide steps to reproduce, affected versions, and any PoC if possible.
3. We will acknowledge within 48 hours and work on a fix.

For third-party dependency vulnerabilities, we use Dependabot and scheduled audits.

Sensitive data should never be committed to the repo. Use `.env` and update `.gitignore` as needed.
# Security Policy 🔒

Thank you for helping keep KisanAI secure! This document describes our security practices and how to report vulnerabilities responsibly.

---

## Responsible Disclosure

If you discover a vulnerability, please create a private issue or email the maintainers listed in CODEOWNERS with steps and reproduction. Do not post publicly until fixed.

Security contact: See SUPPORT.md for contact channels and escalation.

## 📋 Table of Contents

1. [Supported Versions](#supported-versions)
2. [Security Practices](#security-practices)
3. [Reporting Vulnerabilities](#reporting-vulnerabilities)
4. [Our Response Process](#our-response-process)
5. [Security Best Practices](#security-best-practices)
6. [Known Security Considerations](#known-security-considerations)

---

## 🆚 Supported Versions

We maintain security support for:

| Version | Status | Support Until |
|---------|--------|-----------------|
| v1.0.x | ✅ Stable | Dec 2025 |
| v0.4.x | ✅ Stable | Sep 2025 |
| v0.3.x | ⚠️ Legacy | Jun 2025 |
| v0.2.x | ❌ Unsupported | Mar 2025 |
| < v0.2 | ❌ Unsupported | - |

**Security Updates**: Released within 24-48 hours of discovery
**Feature Updates**: Released monthly in stable versions

---

## 🛡️ Security Practices

### Code Security
- ✅ **Type Safety**: Mandatory TypeScript for type checking
- ✅ **Dependency Audits**: `npm audit` before each release
- ✅ **Code Review**: All code reviewed before merge
- ✅ **OWASP Compliance**: Follow OWASP Top 10
- ✅ **Input Validation**: Sanitize all user inputs
- ✅ **Output Encoding**: Encode outputs to prevent XSS

### Data Protection
- ✅ **Encryption**: HTTPS/TLS for all communications
- ✅ **Data Encryption**: Encrypt sensitive data at rest
- ✅ **Access Control**: Implement proper authentication/authorization
- ✅ **Privacy**: GDPR and local privacy compliance
- ✅ **Data Retention**: Clear data deletion policies
- ✅ **Audit Logging**: Log security-relevant events

### Infrastructure Security
- ✅ **Infrastructure as Code**: Secure configuration management
- ✅ **Secrets Management**: Use environment variables, not hardcoded secrets
- ✅ **Monitoring**: Real-time security monitoring
- ✅ **Incident Response**: Have an incident response plan
- ✅ **Regular Updates**: Keep dependencies updated
- ✅ **Security Headers**: Implement security headers

### Development Security
- ✅ **Git Security**: Protect main branch with required reviews
- ✅ **CI/CD Security**: Secure build and deployment pipeline
- ✅ **Dependency Management**: Track and update dependencies
- ✅ **Secret Scanning**: Detect accidentally committed secrets
- ✅ **Security Tests**: Automated security testing in CI
- ✅ **Documentation**: Security documentation for developers

---

## 🚨 Reporting Vulnerabilities

### How to Report

**DO NOT** open a public issue for security vulnerabilities.

**Instead, please email:**

```
ashishparab03@gmail.com
```

**Subject line**: `[SECURITY] Vulnerability Report - [Brief Description]`

### What to Include

Please provide:

1. **Description**
   - What is the vulnerability?
   - What can an attacker do with it?
   - How severe is it?

2. **Affected Component**
   - Which file(s) are affected?
   - Which version(s) are vulnerable?
   - When was it introduced?

3. **Steps to Reproduce**
   - Clear, step-by-step instructions
   - Include sample code if helpful
   - Specify environment (browser, OS, etc.)

4. **Impact**
   - Who is affected? (All users? Specific roles?)
   - What data could be compromised?
   - What systems could be affected?

5. **Proof of Concept**
   - Optional: Minimal code demonstrating the issue
   - **Do not include**:
     - Full exploit code
     - Real user data
     - Any personally identifiable information

6. **Your Information**
   - Name and contact info (can be anonymous)
   - PGP key (optional, if you want encrypted response)

### Example Report

```
Subject: [SECURITY] SQL Injection in farmer search

Description:
The search functionality in /farmer-search endpoint is vulnerable to SQL injection.

Affected Component:
- File: src/api/routes/farmers.js (line 125)
- Version: v0.3.0, v0.4.0
- Introduced: v0.3.0

Steps to Reproduce:
1. Navigate to /search
2. Enter: ' OR '1'='1
3. Observe: Returns all farmers regardless of input

Impact:
- All farmer data could be exposed
- Users could modify other users' data
- Authentication could be bypassed

Code:
The query uses string concatenation:
  const query = `SELECT * FROM farmers WHERE name = '${input}'`

PoC:
  curl "http://localhost:3000/api/search?q=%27%20OR%20%271%27=%271"
```

---

## 📋 Our Response Process

### Step 1: Acknowledgment (24 hours)
- We'll confirm receipt of your report
- Provide you with a ticket number
- Estimate timeline for fix

### Step 2: Investigation (24-48 hours)
- We reproduce the vulnerability
- Assess severity and impact
- Identify affected versions
- Plan a fix

### Step 3: Development (varies)
- Fix the vulnerability
- Write security tests
- Prepare patch release

### Step 4: Verification (24 hours)
- Test the fix thoroughly
- Verify it doesn't introduce new issues
- Get your approval (if possible)

### Step 5: Disclosure (coordinated)
- Release security update
- Publish security advisory
- Public announcement

### Step 6: Recognition (optional)
- Recognize reporter (if desired)
- Add to security advisories
- Public thanks

---

## 🎖️ Vulnerability Severity

We classify vulnerabilities using CVSS v3.1:

### Critical (CVSS 9.0-10.0)
- 🔴 Allows complete system compromise
- 🔴 Exposes all user data
- 🔴 Enables remote code execution
- ⏱️ **Fix Target**: 24 hours
- ⏱️ **Release Target**: 48 hours

### High (CVSS 7.0-8.9)
- 🟠 Significant impact on security
- 🟠 Could compromise multiple accounts
- 🟠 Exposes sensitive data
- ⏱️ **Fix Target**: 72 hours
- ⏱️ **Release Target**: 1 week

### Medium (CVSS 4.0-6.9)
- 🟡 Moderate security impact
- 🟡 Affects specific users/data
- 🟡 Requires specific conditions
- ⏱️ **Fix Target**: 1 week
- ⏱️ **Release Target**: 2 weeks

### Low (CVSS 0.1-3.9)
- 🟢 Minor security impact
- 🟢 Affects edge cases
- 🟢 Limited real-world impact
- ⏱️ **Fix Target**: 2 weeks
- ⏱️ **Release Target**: Next release

---

## 💡 Security Best Practices

### For Users
- ✅ Keep your browser updated
- ✅ Use strong, unique passwords
- ✅ Enable two-factor authentication
- ✅ Don't share your API keys
- ✅ Report suspicious activity
- ✅ Keep your OS and apps updated

### For Developers
- ✅ Never commit secrets (API keys, passwords)
- ✅ Always validate user input
- ✅ Use parameterized queries
- ✅ Implement proper authentication
- ✅ Use security headers
- ✅ Keep dependencies updated
- ✅ Write security tests
- ✅ Review security implications in PRs

### For Contributors
- ✅ Follow secure coding practices
- ✅ Think about security in code review
- ✅ Report issues responsibly
- ✅ Help improve security docs
- ✅ Participate in security discussions

---

## 🔍 Known Security Considerations

### Current Limitations

**API Rate Limiting**
- Status: 🟡 Partially implemented
- Plan: Implement in v0.5.0

**2FA Support**
- Status: 🔴 Not implemented
- Plan: Implement in v0.4.0

**Encryption at Rest**
- Status: 🟡 Partial (new data only)
- Plan: Complete migration in v0.5.0

**API Key Rotation**
- Status: 🟡 Manual process
- Plan: Automated in v1.0.0

**Session Management**
- Status: 🟡 Basic implementation
- Plan: Enhanced in v0.4.0

### Migration Plan

| Issue | Severity | Target Version | Timeline |
|-------|----------|-----------------|----------|
| Rate Limiting | High | v0.5.0 | Q2 2025 |
| 2FA | High | v0.4.0 | Q1 2025 |
| Full Encryption | High | v0.5.0 | Q2 2025 |
| Key Rotation | Medium | v1.0.0 | Q4 2025 |
| Advanced Sessions | Medium | v0.4.0 | Q1 2025 |

---

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/basic-features/data-fetching/getServerSideProps#security)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [npm security advisories](https://www.npmjs.com/advisories)
- [OWASP ZAP](https://www.zaproxy.org/)

### Learning
- [HackTheBox](https://www.hackthebox.com/)
- [TryHackMe](https://tryhackme.com/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

---

## 🔐 PGP Key

For encrypted communication, use our PGP key:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[Key details here]
-----END PGP PUBLIC KEY BLOCK-----
```

[Download full key](./security.gpg)

---

## 🤝 Recognition

We're grateful to security researchers who responsibly disclose vulnerabilities:

**2024 Security Contributors:**
- [Coming soon: First researcher names]

**Special Thanks To:**
- OWASP for security guidelines
- The security research community

---

## 📞 Contact

- 📧 **Security Issues**: ashishparab03@gmail.com
- 🐙 **GitHub**: [@security-team](https://github.com/security-team)
- 🆘 **Emergency**: contact maintainers directly

---

## 🔄 Policy Updates

This policy is reviewed:
- **Quarterly**: Security practices review
- **Annually**: Comprehensive security audit
- **As Needed**: In response to new threats

**Last Updated**: December 2024

---

<div align="center">

### Help us keep KisanAI secure! 🔐

Thank you for your vigilance and responsible disclosure.

[← Back to README](./README.md)

</div>
