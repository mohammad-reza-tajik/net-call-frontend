"use client"
import {Envelope} from "@/components/shared/Icons";
import {drawerActions, useAppDispatch} from "@/store";
import {TooltipProvider} from "@/components/ui/tooltip";
import ActionButton from "@/components/connectPage/ActionButton";

function DrawerButton() {

    const dispatch = useAppDispatch();

    return (
        <TooltipProvider>
            <ActionButton icon={<Envelope className={"size-7"} />} tooltipContent={"درخواست های دریافت شده"} handler={()=> dispatch(drawerActions.openDrawer())} />
        </TooltipProvider>
    )
}

export default DrawerButton;