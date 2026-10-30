import os
import re
import sys
from pathlib import Path

# Terminal colors
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RESET = "\033[0m"

# --- 1. ARCHITECTURE RULES CONFIGURATION ---
HELPERS_FILE = Path("src/utils/helpers.py")
FORBIDDEN_IMPORTS = ["eval", "exec", "pickle.loads"]
MAX_FILE_LINES = 250

def check_architecture(file_path: Path):
    errors = []
    warnings = []

    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    content = "".join(lines)

    # Rule A: File too large (sign of agent-generated monolithic code)
    if len(lines) > MAX_FILE_LINES:
        errors.append(f"File too long ({len(lines)} lines > max {MAX_FILE_LINES}). Agent is creating monolithic code.")

    # Rule B: Forbidden / dangerous instructions
    for forbidden in FORBIDDEN_IMPORTS:
        if forbidden in content:
            errors.append(f"Forbidden instruction detected: '{forbidden}'.")

    # Rule C: Detection of existing helper functions duplication
    if HELPERS_FILE.exists() and file_path != HELPERS_FILE:
        with open(HELPERS_FILE, "r", encoding="utf-8") as hf:
            helper_content = hf.read()
            helper_funcs = re.findall(r"def ([a-zA-Z0-9_]+)\(", helper_content)
            
            for func in helper_funcs:
                if f"def {func}(" in content:
                    errors.append(
                        f"Function duplication! '{func}()' already exists in {HELPERS_FILE}. "
                        f"The agent must import the existing helper instead of re-declaring it."
                    )

    # Rule D: Missing Type Hints on functions
    funcs_without_types = re.findall(r"def [a-zA-Z0-9_]+\([^:\)]*\):", content)
    if funcs_without_types:
        warnings.append(f"{len(funcs_without_types)} function(s) missing Type Hints.")

    return errors, warnings

def main():
    print(f"\n{CYAN}🛡️  [AGENTIC GUARDRAIL] - Scanning codebase architecture...{RESET}\n")

    src_dir = Path("src")
    if not src_dir.exists():
        print(f"{YELLOW}Directory 'src/' not found.{RESET}")
        sys.exit(0)

    total_errors = 0
    total_warnings = 0

    for py_file in src_dir.rglob("*.py"):
        if py_file == HELPERS_FILE:
            continue

        errors, warnings = check_architecture(py_file)

        if errors or warnings:
            print(f"📄 File: {CYAN}{py_file}{RESET}")
            for w in warnings:
                print(f"   {YELLOW}⚠️  WARNING: {w}{RESET}")
                total_warnings += 1
            for e in errors:
                print(f"   {RED}❌ ERROR: {e}{RESET}")
                total_errors += 1
            print()

    print("-" * 50)
    if total_errors > 0:
        print(f"{RED}🚫 COMMIT BLOCKED: {total_errors} critical architectural violation(s) detected.{RESET}\n")
        sys.exit(1)
    else:
        print(f"{GREEN}✅ CODEBASE COMPLIANT: No architectural drift. Validation passed!{RESET}\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
