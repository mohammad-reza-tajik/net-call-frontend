"use client"
import {drawerActions, peerActions, useAppDispatch, useAppSelector} from "@/store";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";
import createAnswer from "@/utils/createAnswer";
import {Request} from "@/types";

function Drawer() {

    const dispatch = useAppDispatch();
    const drawerIsOpen = useAppSelector(state => state.drawer.isOpen);
    const peer = useAppSelector(state => state.peer);
    const {requests} = peer

    async function answerHandler(request: Request) {
        dispatch(peerActions.setStatus("receiveScreen"));
        const answer = await createAnswer({dispatch, peer, request});
    }

    return (
        <div className={"relative"}>
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
                    دستگاه های قابل دسترس
                </h1>
                {!requests || requests.length === 0 ? <p>هیچ دستگاهی وجود ندارد</p> :
                    requests.map((request) => {
                        return <Button variant={"ghost"} size={"sm"} key={request.peerId}
                                       onClick={() => answerHandler(request)}>
                            {request.peerId}
                        </Button>
                    })
                }
            </div>
        </div>
    )
}

export default Drawer;