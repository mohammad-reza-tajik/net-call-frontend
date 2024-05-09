"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Screen} from "@/components/shared/Icons";

function ShareScreen() {

    return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={"icon"}>
                        <Screen className={"size-9"}/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>به اشتراک گذاری صفحه</p>
                </TooltipContent>
            </Tooltip>
    )
}

export default ShareScreen;