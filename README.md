# 🛡️ Agentic Guardrails Linter

A lightweight local linter built in **Python** and **TypeScript** to enforce architecture boundaries, prevent code duplication, and block unsafe AI-generated code drift before it hits production.

## 📌 Problem & Solution
AI coding agents are fast, but they often ignore existing project architecture—duplicating helper functions, introducing banned unsafe methods, or creating monolithic files. 

This repository provides customizable guardrails designed to run in **pre-commit hooks** or **CI pipelines** to ensure engineers stay in control of code structure.

## 📁 Repository Structure
- **`/python`**: Complete Python architecture linter implementation.
- **`/typescript`**: Complete TypeScript architecture linter implementation with ESM support.

## 🚀 Quick Starts

### TypeScript
```bash
cd typescript
npm install
npm run lint
