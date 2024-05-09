"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Video} from "@/components/shared/Icons";

function VideoCall() {

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button size={"icon"}>
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