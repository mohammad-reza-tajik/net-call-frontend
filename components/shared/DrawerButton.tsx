"use client"
import {Button} from "@/components/ui/button";
import {Envelope} from "@/components/shared/Icons";
import {drawerActions, useAppDispatch} from "@/store";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

function DrawerButton() {

    const dispatch = useAppDispatch();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={"icon"} onClick={()=> dispatch(drawerActions.openDrawer())}>
                        <Envelope className={"size-8"} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>درخواست های دریافتی</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default DrawerButton;