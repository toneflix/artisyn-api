export const flattenObject = (obj: Record<string, string | string[] | undefined>): Record<string, string | undefined> => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] ?? undefined : value,
        ])
    );
}
