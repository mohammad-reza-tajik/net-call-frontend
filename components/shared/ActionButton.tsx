import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";

interface IProps {
    icon: React.ReactNode;
    tooltipContent: string;
    handler: () => void;
    className?: string;
}

function ActionButton({ icon, tooltipContent, handler, className }: IProps) {
    return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={"icon"} onClick={handler} className={className}>
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>

    )
}

export default ActionButton;