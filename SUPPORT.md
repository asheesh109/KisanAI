# Support

Need help? We provide multiple channels for support:

- **GitHub Issues**: Open an issue using the appropriate template.
- **Discussions**: For conceptual questions or community help.
- **Email**: ashishparab03@gmail.com (for sensitive communication)

For faster help, include:
- OS and browser
- Node/npm versions
- Steps to reproduce
- Logs and screenshots
# Support & Getting Help 💬

Thank you for using KisanAI! We're here to help if you have any questions or need support.

---

## 📖 Documentation

### Getting Started
- **[Setup Guide](./docs/SETUP.md)** - Step-by-step installation
- **[README](./README.md)** - Project overview
- **[Architecture](./docs/ARCHITECTURE.md)** - System design

### Development
- **[Coding Standards](./docs/CODING_STANDARDS.md)** - Code style guide
- **[API Documentation](./docs/API.md)** - API reference
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

### Reference
- **[Roadmap](./ROADMAP.md)** - Future plans
- **[FAQ](./docs/FAQ.md)** - Common questions
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues

---

## 🤝 Community Support

### GitHub Discussions
For questions and discussions about:
- How to use features
- Implementation questions
- Feature ideas
- General discussions

👉 **[Open a Discussion](https://github.com/asheesh109/KisanAI/discussions)**

### GitHub Issues
For bug reports and feature requests:
- **[Report a Bug](https://github.com/asheesh109/KisanAI/issues/new?template=bug_report.md)**
- **[Request a Feature](https://github.com/asheesh109/KisanAI/issues/new?template=feature_request.md)**

### Email Support
For sensitive matters or partnership inquiries:
- 📧 **ashishparab03@gmail.com**
- 📧 **ashishparab03@gmail.com** (Code of Conduct issues)
- 📧 **ashishparab03@gmail.com** (Security issues)

---

## ❓ Frequently Asked Questions

### Setup & Installation

**Q: What are the system requirements?**
A: Node.js 18+, npm 9+, and a modern browser. See [Setup Guide](./docs/SETUP.md).

**Q: How do I get API keys?**
A: Follow the [environment setup guide](./docs/SETUP.md#environment-variables).

**Q: Can I run this offline?**
A: Partially - see [offline setup guide](./docs/OFFLINE.md).

### Development

**Q: How do I contribute?**
A: Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the complete guide.

**Q: Where should I report bugs?**
A: Please file an [issue on GitHub](https://github.com/asheesh109/KisanAI/issues).

**Q: How do I request a feature?**
A: Create a [feature request issue](https://github.com/asheesh109/KisanAI/issues/new?template=feature_request.md).

### Deployment

**Q: How do I deploy KisanAI?**
A: See [Deployment Guide](./docs/DEPLOYMENT.md).

**Q: What are the hosting options?**
A: Vercel, self-hosted, or Docker containers. See deployment docs.

**Q: What are the costs?**
A: Free tier available for open source. See pricing page.

---

## 🐛 Troubleshooting

### Common Issues

#### "Port 3000 is already in use"
```bash
# Kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or use a different port:
npm run dev -- -p 3001
```

#### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### "MongoDB connection failed"
```bash
# Check your MONGODB_URI in .env.local
# Ensure MongoDB is running
# Test connection string in MongoDB Compass
```

#### "Voice recognition not working"
- Check browser console for errors
- Verify microphone permissions
- Try a different browser
- See [voice troubleshooting](./docs/TROUBLESHOOTING.md#voice)

### More Help

👉 **[Full Troubleshooting Guide](./docs/TROUBLESHOOTING.md)**

---

## 🎓 Learning Resources

### Recommended For Beginners
- **[Getting Started](./docs/SETUP.md)** - Start here
- **[First Contribution](./CONTRIBUTING.md#for-beginners)** - How to make your first PR
- **[Good First Issues](https://github.com/asheesh109/KisanAI/labels/good%20first%20issue)** - Easy tasks

### Recommended For Intermediate
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Understand the codebase
- **[API Reference](./docs/API.md)** - Learn the APIs
- **[Coding Standards](./docs/CODING_STANDARDS.md)** - Code style

### Recommended For Advanced
- **[Contributing Advanced Features](./CONTRIBUTING.md#for-advanced-contributors)** - Complex tasks
- **[Performance Optimization](./docs/PERFORMANCE.md)** - Optimization tips
- **[System Design](./docs/ARCHITECTURE.md#detailed-architecture)** - Deep dive

---

## 💬 Ways to Get Help

### For Usage Questions
1. Check the **[FAQ](./docs/FAQ.md)**
2. Search **[Discussions](https://github.com/asheesh109/KisanAI/discussions)**
3. Open a **[new discussion](https://github.com/asheesh109/KisanAI/discussions/new)**

### For Bugs & Issues
1. Check **[existing issues](https://github.com/asheesh109/KisanAI/issues)**
2. Read **[Troubleshooting](./docs/TROUBLESHOOTING.md)**
3. **[Report new bug](https://github.com/asheesh109/KisanAI/issues/new?template=bug_report.md)**

### For Development Help
1. Review **[Contributing Guide](./CONTRIBUTING.md)**
2. Check **[Code of Conduct](./CODE_OF_CONDUCT.md)**
3. Ask in **[GitHub Discussions](https://github.com/asheesh109/KisanAI/discussions)**

### For Sensitive Issues
- 🔒 **Security**: [SECURITY.md](./SECURITY.md)
- ⚖️ **Conduct**: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- 📧 **Private**: Email ashishparab03@gmail.com

---

## 📞 Contact Information

### Team Contacts
- **Project Lead**: [@maintainer-name](https://github.com/maintainer-name)
- **Community Manager**: [@community-manager](https://github.com/community-manager)
- **Security Team**: [security@kisanai.example.com](mailto:security@ashishparab03@gmail.com)

### Support Channels
- 💬 [GitHub Discussions](https://github.com/asheesh109/KisanAI/discussions)
- 🐛 [GitHub Issues](https://github.com/asheesh109/KisanAI/issues)
- 📧 [Email](mailto:support@ashishparab03@gmail.com)


---

## ⏱️ Response Times

### GitHub Issues & PRs
- **Bugs**: 24-48 hours
- **Features**: 48-72 hours
- **Documentation**: 24-48 hours

### GitHub Discussions
- **Questions**: 24-48 hours
- **Feature Discussion**: 48-72 hours

### Email Support
- **Urgent**: 24 hours
- **Standard**: 48-72 hours

---

## 🆘 Emergency Support

For critical issues:

1. **Check if it's security-related**: See [SECURITY.md](./SECURITY.md)
2. **Post in issues with `urgent` label**: For production-breaking bugs
3. **Contact maintainers**: [@maintainer-name](https://github.com/asheesh109) on GitHub
4. **Email**: emergency@kisanai.example.com

---

## 📋 Support Commitment

We're committed to:

✅ Responding to all issues and discussions
✅ Helping beginners get started
✅ Providing clear documentation
✅ Maintaining a welcoming community
✅ Fixing critical bugs quickly
✅ Being transparent about limitations

---

## 🙏 Thank You!

Thank you for being part of the KisanAI community. We appreciate your support, feedback, and contributions!

---

<div align="center">

### Need more help?

🔍 [Search Documentation](./docs) | 💬 [Start Discussion](https://github.com/asheesh109/KisanAI/discussions) | 📧 [Contact Us](mailto:ashishparab03@gmail.com)

## Maintainers

- **Project Lead:** @asheesh109
- **Community Manager:** @asheesh109
- For urgent repository matters, reach out via GitHub Discussions or use the contact emails in this file.

[← Back to README](./README.md)

</div>
