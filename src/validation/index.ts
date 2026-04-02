import z from 'zod'
import { PropertyType } from '../types';

//* Auth
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const registerSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.email(),
    password: z.string().min(8)
});

export const updateUserSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.email(),
    password: z.string().min(8).or(z.literal('')),
    confirmPassword: z.string().min(8).or(z.literal('')),
}).refine(
    data => data.password === data.confirmPassword,
    { message: 'Passwords do not match', path: ['confirmPassword'] }
);
export type ISignup = z.infer<typeof registerSchema>;

//* Property
export const searchPropertySchema = z.object({
    title: z.string().catch(''),
    location: z.string().catch(''),
    price: z.coerce.number().positive().catch(0),
    type: z.enum(Object.values(PropertyType)).catch('apartment'),
}).partial();
export type ISearchProperty = z.infer<typeof searchPropertySchema>;

export const createPropertySchema = z.object({
    title: z.string().min(3),
    price: z.number().positive(),
    location: z.string().min(1),
    type: z.enum(Object.values(PropertyType)),
}).strict();

export type ICreatePropertyInput = z.infer<typeof createPropertySchema>;

export const validateImages = (images: File[]): string | null => {
    if (!images.length) return 'At least one image is required';
    if (images.length > 5) return 'Max 5 images allowed';

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const img of images) {
        if (!allowedTypes.includes(img.type)) return `${img.name} is not a valid image type`;
        if (img.size > maxSize) return `${img.name} exceeds 5MB`;
    }

    return null;
};

export const updatePropertySchema = z.object({
    title: z.string().min(3).optional(),
    price: z.number().positive().optional(),
    location: z.string().optional(),
    type: z.enum(Object.values(PropertyType)).optional(),
}).strict();
export type IUpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export const propertySearchSchema = z.object({
    propertyId: z.string(),
});