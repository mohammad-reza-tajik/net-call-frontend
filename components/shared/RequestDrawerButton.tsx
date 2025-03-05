"use client";
import {Envelope} from "@/components/shared/Icons";
import {isRequestsDrawerOpenSignal} from "@/signals/drawer";
import {TooltipProvider} from "@/components/ui/tooltip";
import ActionButton from "@/components/connectPage/ActionButton";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import RequestItem from "@/components/shared/RequestItem";
import Drawer from "@/components/shared/Drawer";
import {useSignals} from "@preact/signals-react/runtime";
import cn from "@/lib/utils/cn";
import haveNewRequestSignal from "@/signals/haveNewRequest";

function RequestDrawerButton() {

    useSignals();

    const closeDrawerHandler = () => {
        isRequestsDrawerOpenSignal.value = false;
    };

    return (
        <TooltipProvider>
            <ActionButton className={cn({"animate-bounce": haveNewRequestSignal.value})}
                          icon={<Envelope className={"size-7"}/>}
                          tooltipContent={"درخواست های دریافت شده"}
                          handler={() => {
                              isRequestsDrawerOpenSignal.value = true;
                              haveNewRequestSignal.value = false;
                          }}/>
            <Drawer isOpen={isRequestsDrawerOpenSignal.value}
                    onClose={closeDrawerHandler}
                    direction={"left"}
                    title={"درخواست های دریافتی"}
            >
                {receivedRequestsSignal.value.length === 0 ?
                    <p className={"text-center text-sm p-2"}>هیچ درخواستی وجود ندارد</p> :
                    receivedRequestsSignal.value.map((request, index) => {
                        return <RequestItem request={request} key={index}/>;
                    })
                }
            </Drawer>
        </TooltipProvider>
    );
}

export default RequestDrawerButton;