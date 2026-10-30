// ERROR 1: AI Agent duplicates existing helper instead of importing it
export function formatUserName(firstName, lastName) {
    return firstName + " " + lastName;
}
export function processData(dataString) {
    // ERROR 2: AI Agent uses unsafe forbidden evaluation
    const result = eval(dataString);
    return result;
}
