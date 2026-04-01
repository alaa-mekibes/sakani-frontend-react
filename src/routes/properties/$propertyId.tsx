import { createFileRoute, notFound } from '@tanstack/react-router'
import { api } from '../../lib/api';
import type { IGetProperty } from '../../interfaces';
import { Home, MapPin, DollarSign, User, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/properties/$propertyId')({
    loader: async ({ params }) => {
        const res = await api.get<IGetProperty>(`/property/${params.propertyId}`);
        if (!res?.data) throw notFound();
        return { property: res.data };
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { property } = Route.useLoaderData();
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-DZ', {
            style: 'currency',
            currency: 'DZD',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-DZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate({ to: '/properties' })}
                    className="btn btn-ghost gap-2 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Properties
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="card bg-base-100 shadow-xl">
                            <figure className="relative h-96 bg-base-200">
                                {property.images?.[0] ? (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Home className="h-24 w-24 text-base-content/30" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <div className="badge badge-primary badge-lg">{property.type}</div>
                                </div>
                            </figure>
                        </div>

                        {/* Property Details */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-3xl font-bold mb-4">
                                    {property.title}
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-base-content/70">
                                        <MapPin className="h-5 w-5" />
                                        <span className="text-lg">{property.location}</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-primary font-bold">
                                        <DollarSign className="h-6 w-6" />
                                        <span className="text-3xl">{formatPrice(property.price)}</span>
                                    </div>

                                    <div className="divider"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-base-content/70">
                                            <User className="h-5 w-5" />
                                            <div>
                                                <p className="text-sm font-semibold">Owner</p>
                                                <p>{property.owner}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-base-content/70">
                                            <Calendar className="h-5 w-5" />
                                            <div>
                                                <p className="text-sm font-semibold">Listed</p>
                                                <p>{formatDate(property.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {property.updatedAt !== property.createdAt && (
                                        <p className="text-sm text-base-content/50 mt-2">
                                            Last updated: {formatDate(property.updatedAt)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Interested in this property?</h3>
                                <p className="text-base-content/70 text-sm">
                                    Contact the owner directly to schedule a viewing or ask questions.
                                </p>
                                <div className="card-actions mt-4">
                                    <button className="btn btn-primary w-full">
                                        Contact Owner
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-lg">Property ID</h3>
                                <p className="font-mono text-sm text-base-content/70 break-all">
                                    {property._id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}