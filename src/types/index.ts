//*
export const PropertyType = {
    House: "house",
    Apartment: "apartment",
    Land: "land",
} as const;

export type PropertyType = typeof PropertyType[keyof typeof PropertyType];