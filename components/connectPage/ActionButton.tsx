"use client";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";

interface IActionButtonProps {
    icon: React.ReactNode;
    tooltipContent: string;
    handler: () => void;
    className?: string;
}

function ActionButton({ icon, tooltipContent, handler, className }: IActionButtonProps) {
    return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button size={"icon"} variant={"outline"} onClick={handler} className={className} aria-label={tooltipContent}>
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>

    );
}

export default ActionButton;