"use client"

import {TooltipProvider} from "@/components/ui/tooltip";
import {useAppDispatch, useAppSelector} from "@/store";
import features from "@/constants/features";
import ActionButton from "@/components/connectPage/ActionButton";

function Features() {

    const peer = useAppSelector(state => state.peer);
    const {status} = peer;
    const dispatch = useAppDispatch();

    if (status){
        return
    }

    return (
        <div className={"flex justify-center items-center gap-5"}>
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