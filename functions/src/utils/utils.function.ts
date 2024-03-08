const crypto = require('crypto');

// based on time to avoid collisions
export function generateUniqueToken(): string {
    const timestamp = Date.now().toString();
    const randomValue = crypto.randomBytes(32).toString('hex');
    const token = timestamp + randomValue;
    return token;
}
