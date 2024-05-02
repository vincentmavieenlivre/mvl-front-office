export function pluralize(word: any, count: number) {
    if (count === 1) {
        return word; // Singular form
    } else {
        // Simple pluralization by adding 's'
        return word + 's'; // Plural form
    }
}