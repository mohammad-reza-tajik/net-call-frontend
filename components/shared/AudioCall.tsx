"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Phone} from "@/components/shared/Icons";
import {useAppDispatch, useAppSelector} from "@/store";
import audioCall from "@/utils/audioCall";

function AudioCall() {

    const dispatch = useAppDispatch();
    const peer = useAppSelector(state => state.peer);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button size={"icon"} onClick={()=>audioCall({dispatch,peer})}>
                    <Phone className={"size-9"}/>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>تماس صوتی</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default AudioCall;