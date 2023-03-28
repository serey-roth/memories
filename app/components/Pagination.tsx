import type { PaginationProps } from "flowbite-react";
import { Pagination as FlowBitePagination } from "flowbite-react";

export const Pagination = (props: PaginationProps) => {
    return (
        <FlowBitePagination
        {...props}
        theme={{
            pages: {
                selector: {
                    base: 'w-12 border border-gray-300 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
                    active:
                        'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white',
                },
            }
        }} />
    )
}