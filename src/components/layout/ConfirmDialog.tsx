import { X } from "lucide-react";

interface IProp {
    title: string;
    text?: string;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmDialog = ({ title, text, open, onClose, onConfirm }: IProp) => {
    if (!open) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">

                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    <X />
                </button>

                <h3 className="font-bold text-lg">
                    {title || "Are you sure?"}
                </h3>

                {text && <p className="py-4">{text}</p>}

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="btn btn-ghost">
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="btn btn-error"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmDialog;