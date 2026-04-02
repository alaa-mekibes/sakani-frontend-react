import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { searchPropertySchema } from '../../validation'
import { api } from '../../lib/api'
import type { IGetProperty } from '../../interfaces';
import NoData from '../../components/layout/NoData';
import { Plus, User, Building } from 'lucide-react';
import SearchCard from '../../components/layout/SearchCard';
import PropertyGrid from '../../components/layout/PropertyGrid';
import { useState } from 'react';

export const Route = createFileRoute('/properties/')({
  validateSearch: searchPropertySchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const params = new URLSearchParams(
      Object.entries(deps)
        .filter(([, v]) => v !== undefined && v !== '' && v !== 0)
        .map(([k, v]) => [k, String(v)])
    );

    const properties = (await api.get<IGetProperty[]>(`/property/?${params.toString()}`)).data;
    const myProperties = (await api.get<IGetProperty[]>(`/property/my`)).data;
    return { properties, myProperties }
  },
  component: PropertyPage,
})

function PropertyPage() {
  const navigate = useNavigate();
  const { properties, myProperties } = Route.useLoaderData();
  const filters = Route.useSearch()

  const [showMine, setShowMine] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Properties
          </h2>
          {showMine ? (
            <p className="text-base-content/70 mt-1">
              Found {myProperties?.length ?? 0} property{myProperties?.length !== 1 ? 's' : ''} for you
            </p>
          ) : (
            <p className="text-base-content/70 mt-1">
              Found {properties?.length ?? 0} property{properties?.length !== 1 ? 's' : ''} for you
            </p>
          )}
        </div>

        <button
          onClick={() => navigate({ to: '/properties/create' })}
          className="btn btn-primary gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      {/* toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-base-200/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="tabs tabs-boxed bg-base-100 p-1">
            <button
              className={`tab gap-2 ${!showMine ? 'tab-active' : ''}`}
              onClick={() => setShowMine(false)}
            >
              <Building className="h-4 w-4" />
              All Properties
            </button>
            <button
              className={`tab gap-2 ${showMine ? 'tab-active' : ''}`}
              onClick={() => setShowMine(true)}
            >
              <User className="h-4 w-4" />
              My Properties
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="badge badge-primary badge-outline gap-1">
            <Building className="h-3 w-3" />
            {properties?.length ?? 0}
          </div>
          <div className="badge badge-secondary badge-outline gap-1">
            <User className="h-3 w-3" />
            {myProperties?.length ?? 0}
          </div>
        </div>
      </div>

      {/* search card */}
      {!showMine && <SearchCard searched={filters} />}

      {/* nodata */}
      {!properties?.length && !showMine ? (
        <NoData text="No properties found" />
      ) : showMine && !myProperties?.length ? (
        <NoData text="You haven't listed any properties yet" />
      ) : (
        <PropertyGrid properties={showMine ? myProperties! : properties!} />
      )}
    </div>
  );
}