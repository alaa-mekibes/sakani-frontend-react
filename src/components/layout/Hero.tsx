import heroImg from '../../assets/realestate-background.jpg'
import SearchCard from './SearchCard'

const Hero = () => {
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
                    <SearchCard searched={{}} />
                </div>
            </div>
        </div>
    )
}

export default Hero