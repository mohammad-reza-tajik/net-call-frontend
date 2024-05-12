"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Video} from "@/components/shared/Icons";
import videoCall from "@/utils/videoCall";
import {useAppDispatch, useAppSelector} from "@/store";

function VideoCall() {

    const dispatch = useAppDispatch();
    const peer = useAppSelector(state => state.peer);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button size={"icon"} onClick={()=>videoCall({dispatch,peer})}>
                    <Video className={"size-9"}/>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>تماس تصویری</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default VideoCall;