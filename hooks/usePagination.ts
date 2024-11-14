import {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {buildURL, range} from "@/lib/utils";

/**
 * Interface for the parameters of the `usePagination` hook.
 * @param totalCount - Total number of items to paginate.
 * @param itemsPerPage - Number of items to display per page.
 * @param siblingCount - Number of sibling pages to display on either side of the current page (default is 1).
 */
interface Params {
    totalCount: number;
    itemsPerPage: number;
    siblingCount?: number;
}

/**
 * Custom hook to handle pagination logic.
 * @param params - Parameters for pagination including total count, items per page, and sibling count.
 * @returns An object containing the pagination range, current page, and a handler to change the page.
 */
function usePagination({itemsPerPage, siblingCount = 1, totalCount}: Params) {
    const [currentPage, setPage] = useState(1);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageQuery = searchParams.get("page");

    /*
      Effect to set the current page based on the query parameter when it changes.
     */
    useEffect(() => {
        if (pageQuery) {
            setPage(+pageQuery);
        }
    }, [pageQuery]);

    /**
     * Callback function to handle page changes.
     * @param page - The new page number to navigate to.
     */
    const pageChangeHandler = useCallback((page: string | number) => {
        setPage(+page);
        router.push(
            buildURL({query: { page : page + "" }}),
            {scroll: true}
        );
    }, []);

    /**
     * Memoized computation to determine the pagination range and other related values.
     * @returns An object containing the pagination range, current page, and page change handler.
     */
    const paginationRange = useMemo(() => {
        const lastPage = Math.ceil(totalCount / itemsPerPage); // Calculate the total number of pages

        /**
         * Reasoning: The total number of page buttons to display includes:
         * - The current page.
         * - The first and last pages.
         * - The previous and next sibling pages.
         * - Two additional slots for the ellipses (...) if needed.
         */
        const totalPageNumbers = 2 * siblingCount + 5;

        /**
         * Reasoning: If the total number of page buttons to display is greater than or equal to the total pages,
         * display all page numbers. This is a simple case where no ellipses are needed.
         */
        if (totalPageNumbers >= lastPage) {
            return range(1, lastPage);
        }

        const firstPageIndex = 1; // The first page index is always 1
        const previousSiblingIndex = Math.max(currentPage - siblingCount, 1); // Calculate the start of the previous siblings
        const nextSiblingIndex = Math.min(currentPage + siblingCount, lastPage); // Calculate the end of the next siblings

        const shouldShowStartDots = previousSiblingIndex > 2; // Determine if we need to show start dots
        const shouldShowEndDots = nextSiblingIndex < lastPage - 2; // Determine if we need to show end dots

        if (!shouldShowStartDots && shouldShowEndDots) {
            // Case 1: No start dots, but end dots are needed
            const startItemCount = 3 + 2 * siblingCount; // Calculate the number of items to show on the start
            const startRange = range(1, startItemCount); // Generate the range for the start items
            return [...startRange, "...", lastPage];  // Combine start items, dots, and last page

        }
        if (shouldShowStartDots && !shouldShowEndDots) {
            // Case 2: start dots are needed, but no end dots
            const endItemCount = 3 + 2 * siblingCount; // Calculate the number of items to show on the end
            const endRange = range(lastPage - endItemCount + 1, lastPage); // Generate the range for the end items
            return [firstPageIndex, "...", ...endRange]; // Combine first page, dots, and end items
        }

        // Case 3: Both start and end dots are needed
        const middleRange = range(previousSiblingIndex, nextSiblingIndex); // Generate the range for the middle items
        return [firstPageIndex, "...", ...middleRange, "...", lastPage]; // Combine first page, dots, middle items, and last page


    }, [totalCount, itemsPerPage, siblingCount, currentPage]);

    return {paginationRange, currentPage, pageChangeHandler};
}

export default usePagination;


