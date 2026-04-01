import { useNavigate } from '@tanstack/react-router'
import heroImg from '../../assets/realestate-background.jpg'
import { useState } from 'react';
import { PropertyType } from '../../types';
import { Search, RotateCcw, Home, MapPin, Banknote } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate()
    const resetObj = {
        title: '',
        price: undefined as number | undefined,
        location: '',
        type: undefined as PropertyType | undefined,
    };

    const [filters, setFilters] = useState(resetObj);

    const handleSearch = () => {
        const hasFilters = Object.values(filters).some(value =>
            value !== undefined && value !== null && value !== ''
        );

        if (hasFilters) {
            navigate({
                to: '/properties',
                search: filters,
            });
        }
    };

    return (
        <div className="hero min-h-screen relative">
            {/* image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${heroImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-base-300/90 via-base-300/70 to-base-300/50 dark:from-black/90 dark:via-black/70 dark:to-black/50"></div>
            </div>

            <div className="hero-content text-center relative z-10 w-full px-4">
                <div className="max-w-4xl">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg mb-6 pb-2">
                        Find Your Dream Home in Algeria
                    </h2>

                    <p className="text-base md:text-lg lg:text-xl text-base-content/80 dark:text-white/80 max-w-2xl mx-auto mb-8">
                        Discover the best properties with Sakani. Explore listings, compare options,
                        and connect effortlessly with owners and agents.
                    </p>

                    {/* Search Card */}
                    <div className="card bg-base-100/95 dark:bg-base-100/90 backdrop-blur-sm shadow-2xl rounded-box w-full">
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
                                    onClick={() => setFilters(resetObj)}
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
                </div>
            </div>
        </div>
    )
}

export default Hero