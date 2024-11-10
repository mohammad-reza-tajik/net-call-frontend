import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, range} from "@/lib/utils";

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
    const paginationRangeRef = useRef<(string | number)[]>([]);
    const [currentPage, setPage] = useState(1);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageQuery = searchParams.get("page");

    /**
     * Effect to set the current page based on the query parameter when it changes.
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
    const pageChangeHandler = useCallback((page: number | string) => {
        setPage(+page);
        router.push(
            formUrlQuery({params: {page}, currentParams: searchParams.toString()}),
            {scroll: true}
        );
    }, []);

    /**
     * Memoized computation to determine the pagination range and other related values.
     * @returns An object containing the pagination range, current page, and page change handler.
     */
    return useMemo(() => {
        const lastPage = Math.ceil(totalCount / itemsPerPage);

        /**
         * Reasoning: The total number of page buttons to display includes:
         * - The current page.
         * - The first and last pages.
         * - The previous and next sibling pages.
         * - Two additional slots for the ellipses (...) if needed.
         */
        const totalPageNumbers = siblingCount + 5;

        /**
         * Reasoning: If the total number of page buttons to display is greater or equal to the total pages,
         * display all page numbers. This is a simple case where no ellipses are needed.
         */
        if (totalPageNumbers >= lastPage) {
            paginationRangeRef.current = range(1, lastPage);
        } else {
            const firstPageIndex = 1;
            const previousSiblingIndex = Math.max(currentPage - siblingCount, 1);
            const nextSiblingIndex = Math.min(currentPage + siblingCount, lastPage);

            const shouldShowLeftDots = previousSiblingIndex > 2;
            const shouldShowRightDots = nextSiblingIndex < lastPage - 2;

            if (!shouldShowLeftDots && shouldShowRightDots) {
                let leftItemCount = 3 + 2 * siblingCount;
                let leftRange = range(1, leftItemCount);

                paginationRangeRef.current = [...leftRange, '...', lastPage];
            } else if (shouldShowLeftDots && !shouldShowRightDots) {
                let rightItemCount = 3 + 2 * siblingCount;
                let rightRange = range(lastPage - rightItemCount + 1, lastPage);

                paginationRangeRef.current = [firstPageIndex, '...', ...rightRange];
            } else {
                let middleRange = range(previousSiblingIndex, nextSiblingIndex);
                paginationRangeRef.current = [firstPageIndex, '...', ...middleRange, '...', lastPage];
            }
        }

        return {paginationRange: paginationRangeRef.current, currentPage, pageChangeHandler};
    }, [totalCount, itemsPerPage, siblingCount, currentPage]);
}

export default usePagination;
