"use client"
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";
import RequestItem from "@/components/shared/RequestItem";
import {useSignals} from "@preact/signals-react/runtime";
import isDrawerOpen from "@/signals/drawer";
import receivedRequests from "@/signals/receivedRequests";

function Drawer() {

    useSignals();

    return (
        <div className={"relative overflow-y-auto"}>
            {isDrawerOpen.value && (
                <div className={"fixed inset-0 bg-foreground opacity-50 z-50"}
                     onClick={() => {isDrawerOpen.value = false}}/>
            )}
            <div
                className={cn("fixed top-0 left-0 h-full w-3/4 sm:w-1/4 flex flex-col gap-2 p-5 bg-background z-50 transition-transform ease-in-out duration-300", {"-translate-x-full": !isDrawerOpen.value})}>
                <Button size={"icon"} variant={"outline"} onClick={() => {isDrawerOpen.value = false}}
                        aria-label={"بستن منو"}>
                    <Close/>
                </Button>
                <h1 className={"my-5 bg-primary text-center p-3 rounded"}>
                    درخواست های دریافت شده
                </h1>
                {receivedRequests.value.length === 0 ? <p className={"text-center"}>هیچ درخواستی وجود ندارد</p> :
                    receivedRequests.value.map((request, index) => {
                        return <RequestItem request={request} key={index} />
                    })
                }
            </div>
        </div>
    )
}

export default Drawer;