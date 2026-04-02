import { User } from "lucide-react"

const DefaultAvatar = ({ className }: { className?: string }) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <User className={`h-16 w-16 text-base-content/40 ${className}`} />
        </div>
    )
}

export default DefaultAvatar