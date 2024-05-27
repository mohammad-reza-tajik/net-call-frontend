"use client"
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";
import RequestItem from "@/components/shared/RequestItem";
import {useSignals} from "@preact/signals-react/runtime";
import isDrawerOpenSignal from "@/signals/drawer";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";

function Drawer() {

    useSignals();

    return (
        <div className={"relative overflow-y-auto"}>
            {isDrawerOpenSignal.value && (
                <div className={"fixed inset-0 bg-foreground opacity-50 z-50"}
                     onClick={() => {isDrawerOpenSignal.value = false}}/>
            )}
            <div
                className={cn("fixed top-0 left-0 h-full w-3/4 sm:w-1/4 flex flex-col gap-2 p-5 bg-background z-50 transition-transform ease-in-out duration-300", {"-translate-x-full": !isDrawerOpenSignal.value})}>
                <Button size={"icon"} variant={"outline"} onClick={() => {isDrawerOpenSignal.value = false}}
                        aria-label={"بستن منو"}>
                    <Close/>
                </Button>
                <h1 className={"my-5 bg-primary text-center p-3 rounded"}>
                    درخواست های دریافت شده
                </h1>
                {receivedRequestsSignal.value.length === 0 ? <p className={"text-center"}>هیچ درخواستی وجود ندارد</p> :
                    receivedRequestsSignal.value.map((request, index) => {
                        return <RequestItem request={request} key={index} />
                    })
                }
            </div>
        </div>
    )
}

export default Drawer;