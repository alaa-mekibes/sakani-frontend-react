import { useState } from "react";
import { Home } from "lucide-react";

interface SafeImageProps {
    src: string | null;
    alt?: string;
    className?: string;
}

export const SafeImage = ({
    src,
    alt = "image",
    className = "",
}: SafeImageProps) => {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div
                className={`flex items-center justify-center bg-base-200 ${className}`}
            >
                <Home className="h-10 w-10 text-base-content/40" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
};