import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react';
import { UpdatePropertyForm } from '../../components/layout/UpdatePropertyForm';
import { api } from '../../lib/api';
import type { IGetProperty } from '../../interfaces';
import { propertySearchSchema } from '../../validation';


export const Route = createFileRoute('/properties/update')({
  validateSearch: propertySearchSchema,
  loaderDeps: ({ search }) => ({ propertyId: search.propertyId }),
  loader: async ({ deps }) => {
    const property = await api.get<IGetProperty>(`/property/${deps.propertyId}`);
    if (!property?.data) throw notFound();
    return { property: property.data };
  },
  component: UpdatePropertyPage,
})

function UpdatePropertyPage() {
  const navigate = useNavigate();
  const { property } = Route.useLoaderData();

  return (
    <div className="bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate({ to: '/properties' })}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </button>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Create New Property
            </h2>
            <p className="text-base-content/70 mb-6">
              Fill in the details below to list your property
            </p>
            <UpdatePropertyForm property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}