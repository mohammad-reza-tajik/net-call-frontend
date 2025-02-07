import cn from "@/lib/utils/cn";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import type {ITextMessage} from "@/types";
import {Check, DoubleChecks} from "@/components/shared/Icons";
import getTimestamp from "@/lib/utils/getTimeStamp";

interface ITextMessageProps {
    message: ITextMessage
}

function TextMessage({message}: ITextMessageProps) {

    return (
        <div
            className={cn("flex flex-col gap-2 border py-3 px-5 rounded max-w-3/4",
                {"bg-primary text-primary-foreground fill-primary-foreground self-start": message.localPeerId === localPeerIdSignal.value},
                {"self-end": message.localPeerId !== localPeerIdSignal.value}
            )}>
            <p className={"text-sm leading-loose text-wrap"}>{message.text}</p>
            <div className={"flex items-center gap-2"}>
                {
                    message.localPeerId === localPeerIdSignal.value ?
                        message.seen ? <DoubleChecks/> :
                            <Check/> :
                        null
                }
                <span className={"text-xs"}>{getTimestamp(message.timestamp)}</span>
            </div>
        </div>
    )
}

export default TextMessage;