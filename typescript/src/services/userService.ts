// ERROR 1: AI Agent duplicates existing helper instead of importing it
export function formatUserName(firstName: string, lastName: string): string {
    return firstName + " " + lastName;
}

export function processData(dataString: string) {
    // ERROR 2: AI Agent uses unsafe forbidden evaluation
    const result = eval(dataString);
    return result;
}
