import {Button} from "@/components/ui/button";
import {Phone, Screen, Video} from "@/components/shared/Icons";
import {Tooltip, TooltipProvider, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";

function Toolbar() {

    return (
        <section className={"flex justify-center items-center p-5 fixed bottom-0 right-0 w-screen border-t gap-5"}>
            <TooltipProvider>
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
            </TooltipProvider>
        </section>
    )
}

export default Toolbar;