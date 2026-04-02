import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { api } from '../../lib/api';
import type { IGetInquiry, IGetProperty, IUser } from '../../interfaces';
import { MapPin, User, Calendar, ArrowLeft, MessageCircle, Mail, Trash2, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { formatDate, priceFormatter } from '../../utils';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { ImageSlider } from '../../components/layout/ImageSlider';
import { useState } from 'react';
import type { InquiryStatus } from '../../types';

export const Route = createFileRoute('/properties/$propertyId')({
    loader: async ({ params }) => {
        const property = (await api.get<IGetProperty>(`/property/${params.propertyId}`)).data;
        if (!property) throw notFound();

        const [owner, inquiry, clientsInquiry] = await Promise.all([
            api.get<IUser>(`/auth/${property.owner}`),
            api.get<IGetInquiry>(`/inquiry/property/${params.propertyId}`),
            api.get<IGetInquiry[]>(`/inquiry/property/${params.propertyId}/all`),
        ]);

        // fetch all buyers in parallel
        const inquiryList = clientsInquiry.data ?? [];
        const buyerIds = [...new Set(inquiryList.map(i => i.buyer))];
        const buyerList = await Promise.all(buyerIds.map(id => api.get<IUser>(`/auth/${id}`)));
        const buyers = Object.fromEntries(buyerIds.map((id, i) => [id, buyerList[i].data!]));

        return { property, owner: owner.data, inquiry: inquiry.data, inquiryList, buyers };
    },
    component: PropertyPage,
})

function PropertyPage() {
    const { property, owner, inquiry, inquiryList, buyers } = Route.useLoaderData();
    const { user } = useAuth();
    const isMine = property.owner === user?._id;
    const navigate = useNavigate();
    const [currentInquiry, setCurrentInquiry] = useState<IGetInquiry | null>(inquiry ?? null);
    const [inquiries, setInquiries] = useState<IGetInquiry[]>(inquiryList);

    const sendInquiry = async () => {
        const res = await api.post(`/inquiry/property/${property._id}`);
        if (res.status === 'success') {
            setCurrentInquiry(res.data as IGetInquiry);
            toast.success('Your message is sent successfully!');
        } else {
            toast.error(res.message ?? 'Failed sending message');
        }
    }

    const deleteInquiry = async () => {
        if (!currentInquiry) return;
        const res = await api.delete(`/inquiry/${currentInquiry._id}`);
        if (res.status === 'success') {
            setCurrentInquiry(null);
            toast.success('Your message is deleted successfully!');
        } else {
            toast.error(res.message ?? 'Failed deleting message');
        }
    }

    const markAsContacted = async (inquiryId: string) => {
        const res = await api.patch(`/inquiry/${inquiryId}/contacted`);
        if (res.status === 'success') {
            setInquiries(prev => prev.map(inq =>
                inq._id === inquiryId ? { ...inq, status: 'contacted' as InquiryStatus } : inq
            ));
            toast.success('Marked as contacted');
        } else {
            toast.error(res.message ?? 'Failed to mark as contacted');
        }
    }

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* header */}
                <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
                    <button onClick={() => navigate({ to: '/properties' })} className="btn btn-ghost gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Properties
                    </button>
                    {isMine && (
                        <Link className="btn btn-primary gap-2" to='/properties/update' search={{ propertyId: property._id }}>
                            Manage Property
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* gallery */}
                        <div className="card bg-base-100 shadow-xl">
                            <figure className="relative h-96 bg-base-200">
                                <ImageSlider images={property.images || []} alt={property.title} />
                                <div className="absolute top-4 right-4">
                                    <div className="badge badge-primary badge-lg">{property.type}</div>
                                </div>
                            </figure>
                        </div>

                        {/* details */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body space-y-4">
                                <h2 className="card-title text-3xl font-bold">{property.title}</h2>

                                <div className="flex items-center gap-3 text-base-content/70">
                                    <MapPin className="h-5 w-5" />
                                    <span className="text-lg">{property.location}</span>
                                </div>

                                <div className="text-primary font-bold text-3xl">{priceFormatter(property.price)}</div>

                                <div className="divider" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-base-content/70">
                                        <User className="h-5 w-5" />
                                        <div>
                                            <p className="text-sm font-semibold">Owner</p>
                                            <p>{owner?.name} - <Link className='text-info hover:underline' to='/profile/$userId' params={{ userId: property.owner }}>View Profile</Link></p>
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
                                    <p className="text-sm text-base-content/50">Last updated: {formatDate(property.updatedAt)}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* sidebar */}
                    <div className="space-y-6">
                        {/* contact */}
                        {!isMine && (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title text-xl flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5 text-primary" /> Interested?
                                    </h3>
                                    <p className="text-base-content/70 text-sm">
                                        Contact the owner directly to schedule a viewing or ask questions.
                                    </p>
                                    <div className="card-actions mt-4">
                                        <button
                                            className={`btn w-full gap-2 ${currentInquiry ? 'btn-error btn-outline' : 'btn-primary'}`}
                                            onClick={currentInquiry ? deleteInquiry : sendInquiry}
                                        >
                                            {currentInquiry
                                                ? <><Trash2 className="h-4 w-4" /> Cancel Request</>
                                                : <><Mail className="h-4 w-4" /> Contact Owner</>
                                            }
                                        </button>
                                        {currentInquiry && (
                                            <p className="text-xs text-center w-full text-base-content/50 mt-2">
                                                Your inquiry has been sent. The owner will contact you soon.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Property ID */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-sm font-mono text-base-content/50">Property ID</h3>
                                <p className="font-mono text-sm text-base-content/70 break-all select-all">{property._id}</p>
                            </div>
                        </div>

                        {/* Inquiries for Owner */}
                        {isMine && (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body p-0">
                                    <div className="p-6 pb-3 border-b border-base-200">
                                        <h3 className="card-title text-xl flex items-center gap-2">
                                            <MessageCircle className="h-5 w-5 text-primary" />
                                            Inquiries ({inquiries.length})
                                        </h3>
                                    </div>

                                    {inquiries.length === 0 ? (
                                        <div className="text-center py-8 px-4">
                                            <MessageCircle className="h-12 w-12 text-base-content/20 mx-auto mb-3" />
                                            <h3 className="text-lg font-semibold">No Inquiries Yet</h3>
                                            <p className="text-sm text-base-content/50">When potential buyers contact you, they'll appear here</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-base-200">
                                            {inquiries.map((inq) => {
                                                const buyer = buyers[inq.buyer];
                                                const isContacted = inq.status === 'contacted';
                                                return (
                                                    <div key={inq._id} className={`p-4 ${!isContacted ? 'bg-primary/5' : 'hover:bg-base-200/50'}`}>
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0 space-y-2">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    {!isContacted && <div className="badge badge-info badge-sm">New</div>}
                                                                    <div className="badge badge-primary gap-1">
                                                                        <User className="h-3 w-3" />{buyer?.name}
                                                                    </div>
                                                                    <div className={`badge gap-1 ${inq.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                                                                        {inq.status === 'pending' ? 'Pending' : 'Contacted'}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-sm text-base-content/60">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>{formatDate(inq.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                            <div className='flex flex-col gap-2'>
                                                                <Link className="btn btn-ghost btn-sm gap-1" to='/profile/$userId' params={{ userId: inq.buyer }}>
                                                                    <Eye className="h-3 w-3" /> View
                                                                </Link>
                                                                {!isContacted && (
                                                                    <button onClick={() => markAsContacted(inq._id)} className="btn btn-primary btn-sm gap-1">
                                                                        <CheckCircle className="h-3 w-3" /> Mark as Contacted
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}