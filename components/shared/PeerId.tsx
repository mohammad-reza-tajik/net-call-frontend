"use client"

import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "react-toastify";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import {useSignals} from "@preact/signals-react/runtime";
import {Skeleton} from "@/components/ui/skeleton";

function PeerId() {

    useSignals();

    async function copyIdHandler() {
        await navigator.clipboard.writeText(localPeerIdSignal.value);
        toast.success("آیدی کپی شد");
    }

    return (
        <TooltipProvider>
            <div className={"flex items-center justify-center gap-2 text-sm max-md:hidden"}>
                <p>
                    آیدی شما :
                </p>
                {
                    !localPeerIdSignal.value ?
                        <Skeleton className={"w-60 h-10"}/> :
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
                }
            </div>
        </TooltipProvider>
    )
}

export default PeerId;