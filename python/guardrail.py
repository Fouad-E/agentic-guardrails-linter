import os
import re
import json

def load_config(root_dir: str) -> dict:
    config_path = os.path.join(root_dir, ".guardrailrc.json")
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "max_lines": 150,
        "banned_functions": ["eval", "exec"],
        "disallowed_imports": {"domain": ["infrastructure", "database"]}
    }

def run_python_guardrail(target_file_path: str, root_dir: str) -> bool:
    config = load_config(root_dir)
    with open(target_file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.splitlines()
    has_errors = False

    print(f"\n🛡️ Running Python Guardrail on: {target_file_path}")

    if len(lines) > config["max_lines"]:
        print(f"❌ [Architecture Error] File exceeds {config['max_lines']} lines limit ({len(lines)} lines).")
        has_errors = True

    for fn in config["banned_functions"]:
        if re.search(r'\b' + fn + r'\s*\(', content):
            print(f"❌ [Security Alert] Banned unsafe function call detected: '{fn}()'.")
            has_errors = True

    normalized_path = target_file_path.replace("\\", "/")
    for layer, forbidden_list in config["disallowed_imports"].items():
        if f"/{layer}/" in normalized_path:
            for line in lines:
                if line.strip().startswith(("import ", "from ")):
                    for forbidden in forbidden_list:
                        if forbidden in line:
                            print(f"❌ [Boundary Error] Layer '{layer}' cannot import '{forbidden}'! Line: {line.strip()}")
                            has_errors = True

    if not has_errors:
        print("✅ [Pass] Code respects architecture guardrails.")
    
    return not has_errors
