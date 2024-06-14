import {cn} from "@/lib/utils";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import type {ITextMessage} from "@/types";
import {Check, DoubleChecks} from "@/components/shared/Icons";
import getTimestamp from "@/utils/getTimestamp";

interface ITextMessageProps {
    message: ITextMessage
}

function TextMessage({message}: ITextMessageProps) {

    return (
        <div
            className={cn("border py-3 px-5 rounded w-max max-w-1/2",
                {"bg-primary text-primary-foreground": message.localPeerId === localPeerIdSignal.value},
                {"self-end": message.localPeerId !== localPeerIdSignal.value}
            )}>
            <p>{message.text}</p>
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