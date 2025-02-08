"use client"

import {TooltipProvider} from "@/components/ui/tooltip";
import features from "@/constants/features";
import ActionButton from "@/components/connectPage/ActionButton";
import statusSignal from "@/signals/peer/status";

function Features() {

    if (statusSignal.value){
        return
    }

    return (
        <div className={"flex justify-center items-center gap-3 p-5 border-t"}>
            <TooltipProvider>
                {
                    features.map((item , index)=>{
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