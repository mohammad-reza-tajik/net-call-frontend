"use client"
import {Envelope} from "@/components/shared/Icons";
import isDrawerOpenSignal from "@/signals/drawer";
import {TooltipProvider} from "@/components/ui/tooltip";
import ActionButton from "@/components/connectPage/ActionButton";

function DrawerButton() {

    return (
        <TooltipProvider>
            <ActionButton icon={<Envelope className={"size-7"} />} tooltipContent={"درخواست های دریافت شده"} handler={()=> {
                isDrawerOpenSignal.value = !isDrawerOpenSignal.value;
            }} />
        </TooltipProvider>
    )
}

export default DrawerButton;