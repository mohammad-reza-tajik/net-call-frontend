"use client"
import {Envelope} from "@/components/shared/Icons";
import {isRequestsDrawerOpenSignal} from "@/signals/drawer";
import {TooltipProvider} from "@/components/ui/tooltip";
import ActionButton from "@/components/connectPage/ActionButton";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import RequestItem from "@/components/shared/RequestItem";
import Drawer from "@/components/shared/Drawer";
import {useSignals} from "@preact/signals-react/runtime";

function DrawerButton() {

    useSignals();

    return (
        <TooltipProvider>
            <ActionButton icon={<Envelope className={"size-7"} />} tooltipContent={"درخواست های دریافت شده"} handler={()=> {
                isRequestsDrawerOpenSignal.value = true;
            }} />
            <Drawer openSignal={isRequestsDrawerOpenSignal}>
                {receivedRequestsSignal.value.length === 0 ? <p className={"text-center"}>هیچ درخواستی وجود ندارد</p> :
                    receivedRequestsSignal.value.map((request, index) => {
                        return <RequestItem request={request} key={index}/>
                    })
                }
            </Drawer>
        </TooltipProvider>
    )
}

export default DrawerButton;