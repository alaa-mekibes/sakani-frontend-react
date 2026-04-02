import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { searchPropertySchema } from '../../validation'
import { api } from '../../lib/api'
import type { IGetProperty } from '../../interfaces';
import NoData from '../../components/layout/NoData';
import { MapPin, ArrowRight, Plus } from 'lucide-react';
import { priceFormatter } from '../../utils';
import { SafeImage } from '../../components/layout/SafeImage';
import SearchCard from '../../components/layout/SearchCard';

export const Route = createFileRoute('/properties/')({
  validateSearch: searchPropertySchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const params = new URLSearchParams(
      Object.entries(deps)
        .filter(([, v]) => v !== undefined && v !== '' && v !== 0)
        .map(([k, v]) => [k, String(v)])
    );

    return api.get<IGetProperty[]>(`/property/?${params.toString()}`);
  },
  component: PropertyPage,
})

function PropertyPage() {
  const navigate = useNavigate();
  const { data } = Route.useLoaderData();
  const filters = Route.useSearch()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent ">
            Properties
          </h2>
          <p className="text-base-content/70">
            Found {data?.length ?? 0} property{data?.length !== 1 ? 's' : ''} for you
          </p>
        </div>

        <button
          onClick={() => navigate({ to: '/properties/create' })}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </button>

      </div>

      {/* search card */}
      <SearchCard searched={filters} />

      {/* check data if exists */}
      {!data?.length ? (<NoData text="No properties found" />) :
        //*  content
        (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((property) => (
            <Link
              key={property._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              to="/properties/$propertyId" params={{ propertyId: property._id }}
            >
              <figure className="relative h-48 overflow-hidden bg-base-200">
                <SafeImage src={property?.images && property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3">
                  <div className="badge badge-primary">{property.type}</div>
                </div>
              </figure>

              <div className="card-body p-5">
                <h3 className="card-title text-xl font-bold line-clamp-1">
                  {property.title}
                </h3>

                <div className="flex items-center gap-2 text-base-content/60 text-sm">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>

                <div className="text-2xl font-bold text-primary mt-2">
                  {priceFormatter(property.price)}
                </div>

                <div className="flex items-center justify-end border-t border-base-200 pt-3 mt-2">
                  <button className="btn btn-ghost btn-sm gap-2 group-hover:gap-3 transition-all">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>)
      }
    </div>
  );
}