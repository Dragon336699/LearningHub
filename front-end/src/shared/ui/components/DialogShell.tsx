import { ReactNode } from "react";

type DialogShellProps = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
};

export const DialogShell = ({
    open,
    title,
    children,
    onClose
}: DialogShellProps) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-lg bg-card text-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="cursor-pointer text-danger hover:text-danger-hover"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};