import crypto from "k6/crypto";

export function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = new Uint8Array(crypto.randomBytes(1))[0] % 16;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Function to validate UUID
export function isValidUuid(uuid: string): boolean {
    if (!uuid || uuid === '' || uuid === '00000000-0000-0000-0000-000000000000') {
        return false;
    }
    return uuidRegex.test(uuid);
}