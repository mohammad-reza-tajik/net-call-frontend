import {cn} from "@/lib/utils";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import type {ITextMessage} from "@/types";
import {Check, DoubleChecks} from "@/components/shared/Icons";

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
            {
                message.localPeerId === localPeerIdSignal.value ?
                    message.seen ? <DoubleChecks/> :
                        <Check/> :
                        null
            }
        </div>
    )
}

export default TextMessage;