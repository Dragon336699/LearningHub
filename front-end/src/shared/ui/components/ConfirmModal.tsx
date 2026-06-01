import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ConfirmModalProps<T> = {
    isLoading?: boolean;
    data?: T;
    onConfirm: (data?: T) => void;
    onCancel: () => void;
    title?: string;
    description?: string;
}

export const ConfirmModal = <T,>({ isLoading, data, onConfirm, onCancel, title, description }: ConfirmModalProps<T>) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />

            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h1 className="text-xl font-semibold text-gray-900">
                    {title || "Are you sure you want to delete this?"}
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    {description || "Do you want to delete this item? This process cannot be undone."}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer rounded-lg px-4 py-2 text-sm bg-sidebar hover:bg-sidebar-hover"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(data)}
                        className="cursor-pointer rounded-lg px-4 py-2 text-sm bg-danger text-white hover:bg-danger-hover"
                    >
                        Confirm
                    </button>
                </div>
                
                {isLoading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-50">
                        <div className="flex flex-col items-center gap-2 text-white">
                            <FontAwesomeIcon
                                icon={faSpinner}
                                spin
                                className="text-xl"
                            />
                            <span className="text-sm">Processing...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}