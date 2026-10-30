/**
 * Official helper function for formatting user full names.
 */
export function formatUserName(firstName: string, lastName: string): string {
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.toUpperCase()}`;
}
