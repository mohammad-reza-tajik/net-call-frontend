import {cn} from "@/lib/utils";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import type {ITextMessage} from "@/types";

interface ITextMessageProps {
    message : ITextMessage
}

function TextMessage({ message }: ITextMessageProps) {

    return (
        <p
           className={cn("border py-3 px-5 rounded w-max max-w-1/2",
               {"bg-primary text-primary-foreground": message.localPeerId === localPeerIdSignal.value},
               {"self-end": message.localPeerId !== localPeerIdSignal.value}
           )}>
            {message.type === "text" ? message.text : "a file sent"}
        </p>
    )
}

export default TextMessage;