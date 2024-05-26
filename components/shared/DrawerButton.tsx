"use client"
import {Envelope} from "@/components/shared/Icons";
import isDrawerOpen from "@/signals/drawer";
import {TooltipProvider} from "@/components/ui/tooltip";
import ActionButton from "@/components/connectPage/ActionButton";

function DrawerButton() {

    return (
        <TooltipProvider>
            <ActionButton icon={<Envelope className={"size-7"} />} tooltipContent={"درخواست های دریافت شده"} handler={()=> {
                isDrawerOpen.value = !isDrawerOpen.value;
            }} />
        </TooltipProvider>
    )
}

export default DrawerButton;