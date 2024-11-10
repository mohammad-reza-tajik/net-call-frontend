"use client"
import usePagination from '@/hooks/usePagination';
import {Button} from "@/components/ui/button";
import {Caret} from "@/components/shared/Icons";

interface Props {
    totalCount: number;
    siblingCount?: number;
    itemsPerPage: number;
}

const Pagination = ({totalCount, siblingCount = 1, itemsPerPage}: Props) => {

    const {paginationRange, pageChangeHandler, currentPage} = usePagination({
        totalCount,
        siblingCount,
        itemsPerPage
    });

    if (totalCount <= itemsPerPage) {
        return null;
    }

    return (
        <div className={"flex justify-center w-full gap-2 items-center my-5"}>
            <Button size={"icon"} variant={"outline"} onClick={() => pageChangeHandler(currentPage - 1)}
                    disabled={currentPage === 1}>
                <Caret />
            </Button>
            {paginationRange.map((pageItem, index) => {
                if (pageItem === "...") {
                    return <span key={index}>&#8230;</span>;
                }
                return (
                    <Button size={"icon"} variant={currentPage === pageItem ? "default" : "outline"}
                            key={index}
                            onClick={() => pageChangeHandler(pageItem)}
                    >
                        {pageItem}
                    </Button>
                );
            })}
            <Button size={"icon"} variant={"outline"} onClick={() => pageChangeHandler(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalCount / itemsPerPage)}>
                <Caret className={"rotate-180"}/>
            </Button>
        </div>
    );
};

export default Pagination;