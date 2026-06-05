import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

type DialogShellProps = {
    open: boolean;
    isLoading?: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
};

export const DialogShell = ({
    open,
    isLoading = false,
    title,
    children,
    onClose
}: DialogShellProps) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => {
                if (!isLoading) onClose();
            }}
        >
            <div
                className="relative w-full max-w-3xl rounded-lg bg-card text-white shadow-xl overflow-y-auto max-h-full animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="min-w-0 text-lg font-semibold break-words">{title}</h2>

                    <button
                        onClick={() => {
                            if (!isLoading) onClose();
                        }}
                        disabled={isLoading}
                        className="cursor-pointer text-danger hover:text-danger-hover disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    {children}
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
};