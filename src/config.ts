export const isLocal = process.env.ENV === 'local';

export const config = {
    table: process.env.TABLE_NAME!,
    isLocal,
} as const;
