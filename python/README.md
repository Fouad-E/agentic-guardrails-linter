# 🛡️ Agentic Guardrails Linter

A lightweight local linter designed to enforce codebase architectural rules and prevent AI-generated code drift (code duplication, banned unsafe functions, monolithic files) before hitting production.

## 🌟 Features
- **Helper Duplication Detection**: Prevents AI agents from reinventing existing utility functions.
- **Security Guardrails**: Flags forbidden or unsafe methods (e.g., `eval`, `exec`).
- **Monolith Prevention**: Restricts maximum file length for better modularity.
- **CI/Pre-Commit Ready**: Returns non-zero exit codes to block unauthorized Git commits.

## 🚀 Quick Start
Run the linter locally:
```bash
python guardrail.py

