"use client"

import {useAppSelector} from "@/store";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "react-toastify";

function PeerId() {

    const peerId = useAppSelector(state => state.peer.peerId);

    async function copyIdHandler () {
        await navigator.clipboard.writeText(peerId!);
        toast("آیدی کپی شد");
    }

    return (
        <TooltipProvider>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={"flex items-center justify-center gap-2 text-sm"}>
                        آیدی شما :

                        {
                            peerId &&
                            <Button variant={"outline"} onClick={copyIdHandler}>
                                {peerId}
                            </Button>
                        }

                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>برای کپی کردن آیدی کلیک کنید</p>
                </TooltipContent>
            </Tooltip>


        </TooltipProvider>
    )
}

export default PeerId;