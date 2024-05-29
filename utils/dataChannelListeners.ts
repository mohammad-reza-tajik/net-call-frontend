import {localDataChannelSignal} from "@/signals/peer/peerConnection";

function dataChannelListeners(dataChannel : RTCDataChannel) {
    dataChannel.addEventListener("open", () => {
        console.log("channel is ready")
    })

    dataChannel.addEventListener("message", (event) => {
        console.log(event)
    })

    localDataChannelSignal.value = dataChannel;
}

export default dataChannelListeners;