"use client"

import {TooltipProvider} from "@/components/ui/tooltip";
import {useAppDispatch, useAppSelector} from "@/store";
import {cn} from "@/lib/utils";
import features from "@/constants/features";
import ActionButton from "@/components/shared/ActionButton";

function Features() {

    const peer = useAppSelector(state => state.peer);
    const {status} = peer;
    const dispatch = useAppDispatch();

    return (
        <div className={cn("flex justify-center items-center gap-5", {"hidden": status})}>
            <TooltipProvider>
                {
                    features({dispatch,peer}).map((item , index)=>{
                        return (
                            <ActionButton key={index} icon={item.icon} tooltipContent={item.tooltipContent} handler={item.handler} />
                        )
                    })
                }
            </TooltipProvider>
        </div>
    )
}

export default Features;