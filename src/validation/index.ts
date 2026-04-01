import z from 'zod'
import { PropertyType } from '../types';

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export const registerSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.email(),
    password: z.string().min(8)
});

export type ISignup = z.infer<typeof registerSchema>;

export const searchPropertySchema = z.object({
    title: z.string().catch(''),
    location: z.string().catch(''),
    price: z.coerce.number().positive().catch(0),
    type: z.enum(Object.values(PropertyType)).catch('apartment'),
}).partial();
