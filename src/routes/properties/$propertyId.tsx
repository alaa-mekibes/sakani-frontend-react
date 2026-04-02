import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { api } from '../../lib/api';
import type { IGetProperty, IUser } from '../../interfaces';
import { MapPin, User, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { formatDate, priceFormatter } from '../../utils';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ImageSlider } from '../../components/layout/ImageSlider';

export const Route = createFileRoute('/properties/$propertyId')({
    loader: async ({ params }) => {
        const property = await api.get<IGetProperty>(`/property/${params.propertyId}`);
        if (!property?.data) throw notFound();

        const owner = await api.get<IUser>(`/auth/${property.data.owner}`);
        return { property: property.data, owner: owner.data };
    },
    component: PropertyPage,
})

function PropertyPage() {
    const { property, owner } = Route.useLoaderData();
    const { user } = useAuth();
    const isMine = property.owner === user?._id;
    const navigate = useNavigate();

    const handleInquiry = async () => {
        const res = await api.post(`/inquiry/property/${property._id}`);
        if (res.status === 'success') {
            toast.success('Your message is send successful!')
        } else {
            toast.error(res.message ?? 'Failed sending message')
        }
    }

    return (
        <div className="bg-base-200">
            <div className="container mx-auto px-4 py-8">
                {/* back */}
                <div className='flex items-center justify-between mb-6'>
                    <button
                        onClick={() => navigate({ to: '/properties' })}
                        className="btn btn-ghost gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Properties
                    </button>
                    {isMine &&
                        <Link className="btn btn-primary "
                            to='/properties/update' search={{ propertyId: property._id }}>
                            manage
                        </Link>
                    }
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* gallery */}
                        <div className="card bg-base-100 shadow-xl">
                            <figure className="relative h-96 bg-base-200">
                                <ImageSlider
                                    images={property.images || []}
                                    alt={property.title}
                                />
                                <div className="absolute top-4 right-4">
                                    <div className="badge badge-primary badge-lg">{property.type}</div>
                                </div>
                            </figure>
                        </div>

                        {/* details */}
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
                                        <span className="text-3xl">{priceFormatter(property.price)}</span>
                                    </div>

                                    <div className="divider"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-base-content/70">
                                            <User className="h-5 w-5" />
                                            <div>
                                                <p className="text-sm font-semibold">Owner</p>
                                                <p>{owner?.name}</p>
                                                <p>{owner?.email}</p>
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

                    {/* sidebar */}
                    <div className="space-y-6">
                        {/* Contact action */}
                        <div className="card bg-base-100 shadow-xl">
                            {!isMine &&
                                <div className="card-body">
                                    <h3 className="card-title text-xl">Interested in this property?</h3>
                                    <p className="text-base-content/70 text-sm">
                                        Contact the owner directly to schedule a viewing or ask questions.
                                    </p>
                                    <div className="card-actions mt-4">
                                        <button className="btn btn-primary w-full"
                                            onClick={handleInquiry}>
                                            Contact Owner
                                        </button>
                                    </div>
                                </div>}
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