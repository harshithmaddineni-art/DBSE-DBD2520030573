const crypto = require('crypto');

// Get secret key from environment or use fallback
const getSecretKey = () => {
    let key = process.env.ENCRYPTION_KEY || 'default_secret_key_32_bytes_long_here';
    if (key.length < 32) {
        key = key.padEnd(32, '0');
    } else if (key.length > 32) {
        key = key.substring(0, 32);
    }
    return key;
};

const algorithm = 'aes-256-cbc';
const secretKey = getSecretKey();

const encrypt = (text) => {
    if (!text) return text;
    // Basic check to see if it's already encrypted format (iv:content)
    if (text.includes(':') && text.split(':')[0].length === 32) return text;
    
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (err) {
        console.error("Encryption error:", err);
        return text;
    }
};

const decrypt = (hash) => {
    if (!hash) return hash;
    try {
        const parts = hash.split(':');
        if (parts.length !== 2) return hash;
        
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(parts[0], 'hex'));
        let decrypted = decipher.update(parts[1], 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        // Return original if decryption fails (e.g., was not encrypted properly)
        return hash;
    }
};

module.exports = { encrypt, decrypt };
