/**
 * Formats a numeric price into Algerian Dinar (DZD) currency.
 * Uses Intl.NumberFormat with 'en-DZ' locale and removes decimal digits.
 * Example: 15000000 → "DZD 15,000,000"
 */
export const priceFormatter = (price: number) => {
    return new Intl.NumberFormat('en-DZ', {
        style: 'currency',
        currency: 'DZD',
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Formats an ISO date string into a readable date format.
 * Uses 'en-DZ' locale with full year, month name, and day.
 * Example: "2026-03-29T15:59:11.850Z" → "March 29, 2026"
 */
export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-DZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * 
 * @param error 
 * @returns custom error message
 */
export const getErrorMessage = (error: unknown): string => {
    //* Native JS error
    if (error instanceof Error) {
        return error.message;
    }

    //* TanStack often throws anything (string, object, etc.)
    if (typeof error === "string") {
        return error;
    }

    //* Custom API error shape 
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error).message === "string"
    ) {
        return (error).message;
    }

    return "Something went wrong";
};