"use client"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Screen} from "@/components/shared/Icons";
import {shareScreen} from "@/utils/shareScreen";
import {useAppDispatch, useAppSelector} from "@/store";

function ShareScreen() {

    const dispatch = useAppDispatch();
    const peer = useAppSelector(state => state.peer);

    return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={"icon"} onClick={()=>shareScreen({dispatch , peer})}>
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