export function validateDBString(input: string): boolean | string {
    if (typeof input === 'string' && input.length <= 30 && input.length > 0) {
        return true;
    } else {
        return 'Please enter a string of 30 characters or less.';
    }
}