import messagesSignal from "@/signals/peer/messages";
import {chatChannelSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import {toast} from "react-toastify";
import hangup from "@/utils/hangup";

function chatChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("message", ({data}) => {
        if (data === "hangup") {
            peerConnectionSignal.value?.close();
            toast.info("ارتباط پایان یافت");
            hangup();
        } else {
            const message = JSON.parse(data);
            messagesSignal.value = [...messagesSignal.value, message];
        }
    })

    chatChannelSignal.value = dataChannel;

}

export default chatChannelListeners;