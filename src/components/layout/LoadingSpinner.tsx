const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center w-full h-75">
            <div className="relative">
                {/* Outer */}
                <div className="w-14 h-14 border-4 border-primary/30 rounded-full animate-spin border-t-primary"></div>
                {/* Inner */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-full blur-sm opacity-70 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;