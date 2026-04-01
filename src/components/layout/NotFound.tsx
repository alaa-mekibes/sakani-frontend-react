import { Link } from '@tanstack/react-router'
const NotFound = ({ title, text }: { title?: string, text?: string }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <p className="text-8xl font-bold text-primary mb-4">404</p>

            <h2 className="text-2xl font-semibold text-base-content mb-2">
                {title ?? "Page Not Found"}
            </h2>
            <p className="text-base-content/70 mb-6 max-w-md">
                {text ?? "The page you're looking for doesn't exist or has been moved."}
            </p>

            <Link
                to='/'
                className="btn"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;