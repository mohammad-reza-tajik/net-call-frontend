import messagesSignal from "@/signals/peer/messages";
import {chatChannelSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import statusSignal from "@/signals/peer/status";
import {toast} from "react-toastify";
import routerSignal from "@/signals/router";

function chatChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("message", ({data}) => {
        if (data === "hangup") {
            peerConnectionSignal.value?.close();
            statusSignal.value = undefined;
            toast.info("ارتباط پایان یافت");
            routerSignal.value?.push("/");
        } else {
            const message = JSON.parse(data);
            messagesSignal.value = [...messagesSignal.value, message];
        }
    })

    chatChannelSignal.value = dataChannel;

}

export default chatChannelListeners;