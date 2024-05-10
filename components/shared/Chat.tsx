import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Chat as ChatIcon} from "@/components/shared/Icons";

function Chat() {

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button size={"icon"}>
                    <ChatIcon className={"size-9"}/>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>گفتگو</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default Chat;