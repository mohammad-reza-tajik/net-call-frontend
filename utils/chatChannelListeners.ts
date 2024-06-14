import messagesSignal from "@/signals/peer/messages";
import {chatChannelSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import {toast} from "react-toastify";
import hangup from "@/utils/hangup";
import {isChatDrawerOpenSignal} from "@/signals/drawer";

function chatChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("message", ({data}) => {
        if (data === "hangup") {
            peerConnectionSignal.value?.close();
            toast.info("ارتباط پایان یافت");
            hangup();
        } else if (data === "seen") {
            messagesSignal.value = messagesSignal.value.map((message)=> {
                return {...message , seen : true}
            })
        }
        else {
            const message = JSON.parse(data);
            messagesSignal.value = [...messagesSignal.value, message];
            if (isChatDrawerOpenSignal.value) {
                chatChannelSignal.value?.send("seen");
            }
        }
    })

    chatChannelSignal.value = dataChannel;

}

export default chatChannelListeners;