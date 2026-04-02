import type { InquiryStatus, PropertyType } from "../types";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    avatar: string | null;
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

export interface IGetInquiry {
    _id: string;
    status: InquiryStatus;
    buyer: string;
    owner: string;
    property: string;
    createdAt: string;
}