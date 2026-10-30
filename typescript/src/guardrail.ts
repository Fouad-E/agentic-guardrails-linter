import * as fs from 'fs';
import * as path from 'path';

interface GuardrailConfig {
  max_lines: number;
  banned_functions: string[];
  disallowed_imports: Record<string, string[]>;
}

function loadConfig(rootDir: string): GuardrailConfig {
  const configPath = path.join(rootDir, '.guardrailrc.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {
    max_lines: 150,
    banned_functions: ['eval', 'exec'],
    disallowed_imports: { domain: ['infrastructure', 'database'] }
  };
}

export function runTypeScriptGuardrail(targetFilePath: string, rootDir: string): boolean {
  const config = loadConfig(rootDir);
  const content = fs.readFileSync(targetFilePath, 'utf-8');
  const lines = content.split('\n');
  let hasErrors = false;

  console.log(`\n🛡️ Running TypeScript Guardrail on: ${targetFilePath}`);

  if (lines.length > config.max_lines) {
    console.error(`❌ [Architecture Error] File exceeds ${config.max_lines} lines limit (${lines.length} lines). Split your code!`);
    hasErrors = true;
  }

  for (const fn of config.banned_functions) {
    const regex = new RegExp(`\\b${fn}\\s*\\(`, 'g');
    if (regex.test(content)) {
      console.error(`❌ [Security Alert] Banned unsafe function call detected: '${fn}()'.`);
      hasErrors = true;
    }
  }

  const normalizedPath = targetFilePath.replace(/\\/g, '/');
  for (const [layer, forbiddenImports] of Object.entries(config.disallowed_imports)) {
    if (normalizedPath.includes(`/${layer}/`)) {
      for (const line of lines) {
        if (line.trim().startsWith('import')) {
          for (const forbidden of forbiddenImports) {
            if (line.includes(`/${forbidden}/`) || line.includes(`../${forbidden}`)) {
              console.error(`❌ [Boundary Error] Layer '${layer}' is forbidden from importing '${forbidden}'! Line: ${line.trim()}`);
              hasErrors = true;
            }
          }
        }
      }
    }
  }

  if (!hasErrors) {
    console.log(`✅ [Pass] Code respects architecture guardrails.`);
  }
  return !hasErrors;
}
