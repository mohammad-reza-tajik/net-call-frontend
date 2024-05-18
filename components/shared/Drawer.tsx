"use client"
import {drawerActions, peerActions, useAppDispatch, useAppSelector} from "@/store";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";
import RequestItem from "@/components/shared/RequestItem";

function Drawer() {

    const dispatch = useAppDispatch();
    const drawerIsOpen = useAppSelector(state => state.drawer.isOpen);
    const peer = useAppSelector(state => state.peer);
    const {receivedRequests} = peer;

    return (
        <div className={"relative overflow-y-auto"}>
            {drawerIsOpen && (
                <div className={"fixed inset-0 bg-foreground opacity-50 z-50"}
                     onClick={() => dispatch(drawerActions.closeDrawer())}/>
            )}
            <div
                className={cn("fixed top-0 left-0 h-full w-3/4 sm:w-1/4 flex flex-col gap-2 p-5 bg-background z-50 transition-transform ease-in-out duration-300", {"-translate-x-full": !drawerIsOpen})}>
                <Button size={"icon"} variant={"outline"} onClick={() => dispatch(drawerActions.closeDrawer())}
                        aria-label={"بستن منو"}>
                    <Close/>
                </Button>
                <h1 className={"my-5 bg-primary text-center p-3 rounded"}>
                    درخواست های دریافت شده
                </h1>
                {!receivedRequests || receivedRequests.length === 0 ? <p className={"text-center"}>هیچ درخواستی وجود ندارد</p> :
                    receivedRequests.map((request, index) => {
                        return <RequestItem request={request} key={index} />
                    })
                }
            </div>
        </div>
    )
}

export default Drawer;