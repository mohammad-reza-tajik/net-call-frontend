"use client"
import {drawerActions, useAppDispatch, useAppSelector} from "@/store";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";

function Drawer() {

    const dispatch = useAppDispatch();
    const drawerIsOpen = useAppSelector(state => state.drawer.isOpen);

    const menuItemsHandler = (url: string) => {
        dispatch(drawerActions.closeDrawer());
    }

    return (
        <div className={"relative"}>
            {drawerIsOpen && (
                <div className={"fixed inset-0 bg-foreground opacity-50 z-50"}
                     onClick={() => dispatch(drawerActions.closeDrawer())}/>
            )}
            <div
                className={cn("fixed top-0 left-0 h-full w-3/4 sm:w-1/4 flex flex-col gap-2 p-5 bg-background z-50 transition-transform ease-in-out duration-300", {"-translate-x-full": !drawerIsOpen})}>
                <Button size={"icon"} variant={"outline"} onClick={() => dispatch(drawerActions.closeDrawer())} aria-label={"بستن منو"}>
                    <Close/>
                </Button>
                <h1 className={"my-5 bg-primary text-center p-3 rounded"}>
                    دستگاه های قابل دسترس
                </h1>
                {
                    Array.from({length : 7}).map((_, index) => {
                        return <button key={index}
                                       className={"flex items-center text-xs sm:text-sm gap-3 rounded hover:bg-foreground/5 border-b p-2 sm:p-4 hover:fill-primary transition-colors"}>
                            {Math.random()}
                        </button>
                    })
                }
            </div>
        </div>
    )
}

export default Drawer;