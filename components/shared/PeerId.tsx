"use client"

import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "react-toastify";
import localPeerIdSignal from "@/signals/peer/localPeerId";

function PeerId() {

    async function copyIdHandler() {
        await navigator.clipboard.writeText(localPeerIdSignal.value);
        toast.info("آیدی کپی شد");
    }

    return (
        <TooltipProvider>
            <div className={"flex items-center justify-center gap-2 text-sm"}>
                آیدی شما :
                <Tooltip>
                    <TooltipTrigger asChild>
                        {
                            <Button variant={"outline"} onClick={copyIdHandler}>
                                {localPeerIdSignal.value}
                            </Button>
                        }
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>برای کپی کردن آیدی کلیک کنید</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}

export default PeerId;