// components/property/CreatePropertyForm.tsx
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { api } from '../../lib/api';
import { PropertyType } from '../../types';
import { Home, MapPin, Banknote, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { FieldInfo } from '../layout/FieldInfo';
import { createPropertySchema, validateImages, type ICreatePropertyInput } from '../../validation';

export const CreatePropertyForm = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (images.length + files.length > 5) {
            toast.error('Max 5 images allowed');
            return;
        }
        setImages(prev => [...prev, ...files]);
        setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const form = useForm({
        defaultValues: {
            title: '',
            location: '',
            price: 0,
            type: PropertyType.Apartment,
        } as ICreatePropertyInput,
        validators: { onSubmit: createPropertySchema },
        onSubmit: async ({ value }) => {
            const imageError = validateImages(images);
            if (imageError) {
                toast.error(imageError);
                return;
            }

            const formData = new FormData();
            Object.entries(value).forEach(([k, v]) => formData.append(k, String(v)));
            images.forEach(img => formData.append('images', img));

            const res = await api.upload('/property', formData);
            if (res.status === 'success') {
                toast.success('Property created! 😎');
                navigate({ to: '/properties' });
            } else {
                toast.error(res.message ?? 'Failed to create property');
            }
        },
    });

    return (
        <div className="space-y-6">

            {/* title */}
            <form.Field name="title">
                {(field) => (
                    <div className="form-control w-full">
                        <label className="label" htmlFor={field.name}>
                            <span className="label-text font-semibold">Title</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <Home size={16} />
                            <input
                                id={field.name}
                                type="text"
                                className="grow"
                                placeholder="Beautiful villa with garden"
                                value={field.state.value}
                                onChange={e => field.handleChange(e.target.value)}
                            />
                        </label>
                        <FieldInfo field={field} />
                    </div>
                )}
            </form.Field>

            {/* location */}
            <form.Field name="location">
                {(field) => (
                    <div className="form-control w-full">
                        <label className="label" htmlFor={field.name}>
                            <span className="label-text font-semibold">Location</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <MapPin size={16} />
                            <input
                                id={field.name}
                                type="text"
                                className="grow"
                                placeholder="Algiers, Algeria"
                                value={field.state.value}
                                onChange={e => field.handleChange(e.target.value)}
                            />
                        </label>
                        <FieldInfo field={field} />
                    </div>
                )}
            </form.Field>

            {/* price */}
            <form.Field name="price">
                {(field) => (
                    <div className="form-control w-full">
                        <label className="label" htmlFor={field.name}>
                            <span className="label-text font-semibold">Price (DZD)</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <Banknote size={16} />
                            <input
                                id={field.name}
                                type="number"
                                className="grow"
                                placeholder="0"
                                min={0}
                                step={1000}
                                value={field.state.value || 0}
                                onChange={e => field.handleChange(Number(e.target.value))}
                            />
                        </label>
                        <FieldInfo field={field} />
                    </div>
                )}
            </form.Field>

            {/* type */}
            <form.Field name="type">
                {(field) => (
                    <div className="form-control w-full">
                        <label className="label" htmlFor={field.name}>
                            <span className="label-text font-semibold">Property Type</span>
                        </label>
                        <select
                            id={field.name}
                            className="select select-bordered w-full"
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value as PropertyType)}
                        >
                            {Object.values(PropertyType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <FieldInfo field={field} />
                    </div>
                )}
            </form.Field>

            {/* images */}
            <div className="form-control w-full flex flex-col gap-2">
                <label className="label">
                    <span className="label-text font-semibold">Images</span>
                </label>

                {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {previewUrls.map((url, i) => (
                            <div key={i} className="relative group">
                                <img src={url} alt={`Preview ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-2 right-2 btn btn-circle btn-xs btn-ghost bg-base-100/80"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {images.length < 5 && (
                    <label className="btn btn-outline w-fit gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Images ({images.length}/5)
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                )}
                <p className="text-xs text-base-content/50 mt-2">JPG, JPEG, PNG, WebP — max 5MB each</p>
            </div>

            {/* actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => navigate({ to: '/properties' })}
                    className="btn btn-ghost flex-1"
                >
                    Cancel
                </button>
                <form.Subscribe selector={s => s.isSubmitting}>
                    {(isSubmitting) => (
                        <button
                            className="btn btn-primary flex-1"
                            onClick={form.handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? <span className="loading loading-spinner" />
                                : 'Create Property'
                            }
                        </button>
                    )}
                </form.Subscribe>
            </div>
        </div>
    );
};