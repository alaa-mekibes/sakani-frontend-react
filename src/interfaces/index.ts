import type { PropertyType } from "../types";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface IGetProperty {
    _id: string;
    title: string;
    location: string;
    price: number;
    type: PropertyType;
    owner: string;
    images: string[],
    createdAt: string;
    updatedAt: string;
}