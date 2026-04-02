import { Home, Banknote, MapPin, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { PropertyType } from "../../types";
import { useNavigate } from '@tanstack/react-router'
import type { ISearchProperty } from "../../validation";


const SearchCard = ({ searched }: { searched: ISearchProperty }) => {
    const navigate = useNavigate()
    const resetObj = {
        title: '',
        price: undefined as number | undefined,
        location: '',
        type: undefined as PropertyType | undefined,
    };

    const [filters, setFilters] = useState(searched ?? resetObj);

    const handleSearch = () => {
        navigate({
            to: '/properties',
            search: filters,
        });
    };

    const handleReset = () => {
        setFilters(resetObj);
        navigate({
            to: '/properties',
            search: resetObj,
        });
    };
    return (
        <div className="card bg-base-100/95 dark:bg-base-100/90 backdrop-blur-sm shadow-2xl rounded-box w-full my-12">
            <div className="card-body p-6 md:p-8">
                <h2 className="card-title text-2xl md:text-3xl text-base-content justify-center mb-6">
                    Search Properties
                </h2>

                {/* Search Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Title */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-base-content/70">Title</span>
                        </label>
                        <div className='input input-bordered flex items-center gap-2 w-full'>
                            <Home size={18} />
                            <input
                                type="text"
                                placeholder="e.g., Villa with garden"
                                value={filters.title || ''}
                                onChange={(e) => setFilters(f => ({ ...f, title: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-base-content/70">Max Price</span>
                        </label>
                        <div className='input input-bordered flex items-center gap-2 w-full'>
                            <Banknote size={18} />
                            <input
                                type="number"
                                placeholder="Enter amount"
                                step={1000}
                                min={0}
                                value={filters.price || ''}
                                onChange={(e) => setFilters(f => ({
                                    ...f,
                                    price: e.target.value ? Number(e.target.value) : undefined
                                }))}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-base-content/70">Location</span>
                        </label>
                        <div className='input input-bordered flex items-center gap-2 w-full'>
                            <MapPin size={18} />
                            <input
                                type="text"
                                placeholder="City or region"
                                value={filters.location || ''}
                                onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Property Type */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-base-content/70">Property Type</span>
                        </label>
                        <select
                            className="select select-bordered w-full focus:select-primary transition-all"
                            value={filters.type || ''}
                            onChange={(e) => setFilters(f => ({
                                ...f,
                                type: e.target.value ? (e.target.value as PropertyType) : undefined,
                            }))}
                        >
                            <option value="">All Types</option>
                            {Object.values(PropertyType).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions justify-end gap-3">
                    <button
                        className="btn btn-ghost gap-2"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset Filters
                    </button>
                    <button
                        className="btn btn-primary gap-2 shadow-md hover:shadow-lg transition-all"
                        onClick={handleSearch}
                    >
                        <Search className="h-4 w-4" />
                        Search Properties
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchCard