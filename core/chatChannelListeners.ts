import messagesSignal from "@/signals/peer/messages";
import {chatChannelSignal} from "@/signals/peer/peerConnection";
import {isChatDrawerOpenSignal} from "@/signals/drawer";
import haveNewMessageSignal from "@/signals/haveNewMessage";
import showNotification from "@/lib/utils/showNotification";
import type {ITextMessage} from "@/types";

function chatChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("message", ({data}) => {
        if (data === "seen") {
            messagesSignal.value = messagesSignal.value.map((message)=> {
                return {...message , seen : true};
            });
        }
        else {
            const newMessage = JSON.parse(data) as ITextMessage;
            showNotification({
                title : "پیام جدید",
                body : newMessage.text,
                tag : `newMessage-${newMessage.localPeerId}`
            });

            messagesSignal.value = [...messagesSignal.value, newMessage];
            if (isChatDrawerOpenSignal.value) {
                chatChannelSignal.value?.send("seen");
            } else {
                haveNewMessageSignal.value = true;
            }
        }
    });

    chatChannelSignal.value = dataChannel;

}

export default chatChannelListeners;