"use client"

import {useAppSelector} from "@/store";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "react-toastify";

function PeerId() {

    const localPeerId = useAppSelector(state => state.peer.localPeerId);

    async function copyIdHandler() {
        await navigator.clipboard.writeText(localPeerId!);
        toast.info("آیدی کپی شد");
    }

    return (
        <TooltipProvider>
            <div className={"flex items-center justify-center gap-2 text-sm"}>
                آیدی شما :
                <Tooltip>
                    <TooltipTrigger asChild>
                        {
                            localPeerId &&
                            <Button variant={"outline"} onClick={copyIdHandler}>
                                {localPeerId}
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