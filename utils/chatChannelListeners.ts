import messagesSignal from "@/signals/peer/messages";
import {chatChannelSignal} from "@/signals/peer/peerConnection";

function chatChannelListeners(dataChannel : RTCDataChannel) {

    dataChannel.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        messagesSignal.value = [...messagesSignal.value, message];
    })

    chatChannelSignal.value = dataChannel;

}

export default chatChannelListeners;