type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) => {

    const generatePages = () => {
        const pages: (number | string)[] = [];
        for (let i = 1; i <= totalPages; i++) {

            const shouldShowPage =
                i === 1 ||
                i === totalPages ||
                i == currentPage - 1 
                || i == currentPage + 1 || i == currentPage;

            if (shouldShowPage ) {
                pages.push(i);
            } else {

                const lastItem =
                    pages[pages.length - 1];

                if (lastItem !== "...") {
                    pages.push("...");
                }
            }
        }

        return pages;
    };

    return (
        <div className="mt-6 flex items-center justify-center gap-2">

            <button
                onClick={() =>
                    onPageChange(
                        Math.max(currentPage - 1, 1)
                    )
                }
                disabled={currentPage === 1}
                className="
                    rounded-lg border border-gray-600
                    px-4 py-2 text-sm text-white
                    transition hover:bg-gray-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                &lt;
            </button>

            {generatePages().map((item, index) => {

                if (item === "...") {
                    return (
                        <span
                            key={`${item}-${index}`}
                            className="
                                px-2 text-gray-400
                            "
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={item}
                        onClick={() =>
                            onPageChange(Number(item))
                        }
                        className={`
                            rounded-lg px-4 py-2
                            text-sm font-medium
                            transition
                            ${
                                currentPage === item
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }
                        `}
                    >
                        {item}
                    </button>
                );
            })}

            <button
                onClick={() =>
                    onPageChange(
                        Math.min(
                            currentPage + 1,
                            totalPages
                        )
                    )
                }
                disabled={
                    currentPage === totalPages
                }
                className="
                    rounded-lg border border-gray-600
                    px-4 py-2 text-sm text-white
                    transition hover:bg-gray-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                &gt;
            </button>
        </div>
    );
};