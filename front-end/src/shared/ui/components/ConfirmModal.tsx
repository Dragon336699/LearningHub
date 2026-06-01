type ConfirmModalProps<T> = {
    data?: T;
    onConfirm: (data?: T) => void;
    onCancel: () => void;
}

export const ConfirmModal = <T,>({ data, onConfirm, onCancel }: ConfirmModalProps<T>) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onCancel}
            />

            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h1 className="text-xl font-semibold text-gray-900">
                    Are you sure you want to delete this?
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    Do you want to delete this item? This process cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg px-4 py-2 text-sm bg-sidebar hover:bg-sidebar-hover"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onConfirm(data)}
                        className="rounded-lg px-4 py-2 text-sm bg-danger text-white hover:bg-danger-hover"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}