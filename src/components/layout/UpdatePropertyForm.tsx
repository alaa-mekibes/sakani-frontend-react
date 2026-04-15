// components/property/UpdatePropertyForm.tsx
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { api } from '../../lib/api';
import { PropertyType } from '../../types';
import { Home, MapPin, Banknote, X, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { FieldInfo } from '../layout/FieldInfo';
import { updatePropertySchema, type IUpdatePropertyInput } from '../../validation';
import { validateImages } from '../../validation';
import type { IGetProperty } from '../../interfaces';
import ConfirmDialog from './ConfirmDialog';

export const UpdatePropertyForm = ({ property }: { property: IGetProperty; }) => {
    const navigate = useNavigate();

    // existing images
    const [existingImages, setExistingImages] = useState<string[]>(property.images ?? []);
    // new images to upload
    const [newImages, setNewImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const totalImages = existingImages.length + newImages.length;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (totalImages + files.length > 5) {
            toast.error('Max 5 images allowed');
            return;
        }
        setNewImages(prev => [...prev, ...files]);
        setPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeExisting = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNew = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const [openConfirm, setOpenConfirm] = useState(false);
    const deleteProperty = async () => {
        const res = await api.delete(`/property/${property._id}`);
        if (res.status === 'success') {
            toast.success('Property deletion succufully');
            setTimeout(() => navigate({ to: '/properties' }), 2000);
        } else {
            toast.error(res.message ?? 'Deletion failed');
        }
    };

    const form = useForm({
        defaultValues: {
            title: property.title,
            location: property.location,
            price: property.price,
            type: property.type,
        } as IUpdatePropertyInput,
        validators: { onSubmit: updatePropertySchema },
        onSubmit: async ({ value }) => {
            if (newImages.length) {
                const imageError = validateImages(newImages);
                if (imageError) {
                    toast.error(imageError);
                    return;
                }
            }

            const formData = new FormData();

            // only append changed fields
            Object.entries(value).forEach(([k, v]) => formData.append(k, String(v)));

            // send existing image URLs to keep
            existingImages.forEach(url => formData.append('existingImages', url));

            // send new images to upload
            newImages.forEach(img => formData.append('images', img));

            const res = await api.uploadPatch(`/property/${property._id}`, formData);
            if (res.status === 'success') {
                toast.success('Property updated! ✅');
                navigate({ to: '/properties/$propertyId', params: { propertyId: property._id } });
            } else {
                toast.error(res.message ?? 'Failed to update property');
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
                                value={field.state.value || ''}
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
            <div className="form-control w-full flex flex-col">
                <label className="label">
                    <span className="label-text font-semibold">Images ({totalImages}/5)</span>
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {/* existing cloudinary images */}
                    {existingImages.map((url, i) => (
                        <div key={`existing-${i}`} className="relative group">
                            <img src={url} alt={`Image ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => removeExisting(i)}
                                className="absolute top-2 right-2 btn btn-circle btn-xs btn-error"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}

                    {/* new image previews */}
                    {previewUrls.map((url, i) => (
                        <div key={`new-${i}`} className="relative group">
                            <img src={url} alt={`New ${i + 1}`} className="w-full h-32 object-cover rounded-lg opacity-80 border-2 border-primary" />
                            <button
                                type="button"
                                onClick={() => removeNew(i)}
                                className="absolute top-2 right-2 btn btn-circle btn-xs btn-error"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {totalImages < 5 && (
                    <label className="btn btn-outline gap-2 mr-auto">
                        <Upload className="h-4 w-4" />
                        Add Images
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

                <button
                    onClick={() => setOpenConfirm(true)}
                    className="btn btn-error ml-auto"
                >
                    <Trash2 size={16} /> Delete Property
                </button>

                {openConfirm && (
                    <ConfirmDialog
                        open={openConfirm}
                        title="Delete your account?"
                        text="This action cannot be undone."
                        onClose={() => setOpenConfirm(false)}
                        onConfirm={() => {
                            deleteProperty();
                            setOpenConfirm(false);
                        }}
                    />
                )}
            </div>

            {/* actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => navigate({ to: '/properties/$propertyId', params: { propertyId: property._id } })}
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
                                : 'Update Property'
                            }
                        </button>
                    )}
                </form.Subscribe>
            </div>
        </div >
    );
};