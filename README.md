# 🛡️ Agentic Guardrails Linter

> **Keep your AI agents (Cursor, Windsurf, Copilot, Claude) on a tight leash.**  
> A dual-stack (Python & TypeScript) architectural guardrail system designed to prevent AI code generators from introducing monoliths, unsafe function calls, or architectural boundary violations.

---

## 📌 Problem & Solution

AI coding agents are fast, but they often ignore existing project architecture:
1. **Monolithic files**: Generating bloated single-file code instead of modular components.
2. **Unsafe functions**: Injecting banned methods like `eval()` or `exec()`.
3. **Boundary violations**: Direct import of infrastructure/database code inside core domain layers.

`agentic-guardrails-linter` acts as an automated architectural gatekeeper for local pre-commit hooks or remote CI/CD pipelines.

---

## 📁 Repository Structure

- **`/python`**: Complete Python implementation with custom scanner modules.
- **`/typescript`**: Complete TypeScript (ESM, TS 5) implementation.
- **`/.github/workflows`**: Automated GitHub Actions CI/CD pipeline.

---

## ✨ Features

- **📄 JSON Config Driven (`.guardrailrc.json`)**: Customizable line limits and rules.
- **🧱 Monolith Prevention**: Flags files exceeding maximum line thresholds.
- **🔒 Security Enforcement**: Blocks banned unsafe functions.
- **🗺️ Layer Boundary Protection**: Prevents illegal imports across layers (e.g., `domain` $\rightarrow$ `infrastructure`).
- **⚡ Dual Stack**: Native support for both **Python 3.11+** and **TypeScript**.
- **🤖 CI/CD Ready**: Automated validation pipeline included.

---

## 🛠️ Configuration (`.guardrailrc.json`)

Create a `.guardrailrc.json` in your project root:

```json
{
  "max_lines": 150,
  "banned_functions": ["eval", "exec"],
  "disallowed_imports": {
    "domain": ["infrastructure", "database"]
  }
}
