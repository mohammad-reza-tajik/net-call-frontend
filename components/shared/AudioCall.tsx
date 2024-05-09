"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Phone} from "@/components/shared/Icons";

function AudioCall() {

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button size={"icon"}>
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