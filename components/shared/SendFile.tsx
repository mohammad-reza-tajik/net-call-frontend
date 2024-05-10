import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Attach} from "@/components/shared/Icons";

function SendFile() {

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button size={"icon"}>
                    <Attach className={"size-9"}/>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>ارسال فایل</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default SendFile;