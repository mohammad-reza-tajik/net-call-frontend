import messagesSignal from "@/signals/peer/messages";
import {chatChannelSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import {toast} from "react-hot-toast";
import hangup from "@/utils/hangup";
import {isChatDrawerOpenSignal} from "@/signals/drawer";
import haveNewMessageSignal from "@/signals/haveNewMessage";

function chatChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("message", ({data}) => {
        if (data === "seen") {
            messagesSignal.value = messagesSignal.value.map((message)=> {
                return {...message , seen : true}
            })
        }
        else {
            const newMessage = JSON.parse(data);
            messagesSignal.value = [...messagesSignal.value, newMessage];
            if (isChatDrawerOpenSignal.value) {
                chatChannelSignal.value?.send("seen");
            } else {
                haveNewMessageSignal.value = true;
            }
        }
    })

    chatChannelSignal.value = dataChannel;

}

export default chatChannelListeners;