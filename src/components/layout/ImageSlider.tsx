// components/ui/ImageSlider.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ImageSliderProps {
    images: string[];
    alt: string;
}

export const ImageSlider = ({ images, alt }: ImageSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return <SafeImage src={null} />
    }

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full h-full group">
            <img
                src={images[currentIndex]}
                alt={`${alt} - ${currentIndex + 1}`}
                className="w-full h-full object-cover"
            />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-none"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 border-none"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-2 right-2 bg-base-100/80 px-2 py-1 rounded-lg text-xs">
                        {currentIndex + 1} / {images.length}
                    </div>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all ${idx === currentIndex
                                        ? 'w-4 bg-primary'
                                        : 'w-1.5 bg-base-content/50'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};