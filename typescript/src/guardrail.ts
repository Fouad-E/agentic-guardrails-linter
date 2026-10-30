import * as fs from 'fs';
import * as path from 'path';

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

const FORBIDDEN_PATTERNS = ["eval(", "exec(", "pickle.loads"];
const MAX_FILE_LINES = 250;

function checkArchitecture(filePath: string): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    if (lines.length > MAX_FILE_LINES) {
        errors.push(`File too long (${lines.length} lines > max ${MAX_FILE_LINES}). Agent is creating monolithic code.`);
    }

    for (const forbidden of FORBIDDEN_PATTERNS) {
        if (content.includes(forbidden)) {
            errors.push(`Forbidden instruction detected: '${forbidden.replace('(', '')}'.`);
        }
    }

    const targetHelpersFile = path.join(process.cwd(), 'src', 'utils', 'helpers.ts');
    if (fs.existsSync(targetHelpersFile) && !filePath.endsWith('helpers.ts')) {
        const helperContent = fs.readFileSync(targetHelpersFile, 'utf-8');
        const helperFuncs = helperContent.match(/export function ([a-zA-Z0-9_]+)\(/g) || [];
        
        for (const funcMatch of helperFuncs) {
            const funcName = funcMatch.replace('export function ', '').replace('(', '');
            if (content.includes(`function ${funcName}(`) || content.includes(`const ${funcName} =`)) {
                errors.push(`Function duplication! '${funcName}()' already exists in utils/helpers.ts.`);
            }
        }
    }

    return { errors, warnings };
}

function main() {
    console.log(`\n${CYAN}🛡️  [AGENTIC GUARDRAIL - TS] - Scanning codebase architecture...${RESET}\n`);

    const srcDir = path.join(process.cwd(), 'src');
    if (!fs.existsSync(srcDir)) {
        console.log(`${YELLOW}Directory 'src/' not found.${RESET}`);
        process.exit(0);
    }

    let totalErrors = 0;
    let totalWarnings = 0;

    function walkDir(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath);
            } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('guardrail.ts')) {
                const { errors, warnings } = checkArchitecture(fullPath);
                if (errors.length > 0 || warnings.length > 0) {
                    console.log(`📄 File: ${CYAN}${path.relative(process.cwd(), fullPath)}${RESET}`);
                    for (const w of warnings) {
                        console.log(`   ${YELLOW}⚠️  WARNING: ${w}${RESET}`);
                        totalWarnings++;
                    }
                    for (const e of errors) {
                        console.log(`   ${RED}❌ ERROR: ${e}${RESET}`);
                        totalErrors++;
                    }
                    console.log();
                }
            }
        }
    }

    walkDir(srcDir);

    console.log("-".repeat(50));
    if (totalErrors > 0) {
        console.log(`${RED}🚫 COMMIT BLOCKED: ${totalErrors} critical architectural violation(s) detected.${RESET}\n`);
        process.exit(1);
    } else {
        console.log(`${GREEN}✅ CODEBASE COMPLIANT: No architectural drift. Validation passed!${RESET}\n`);
        process.exit(0);
    }
}

main();
