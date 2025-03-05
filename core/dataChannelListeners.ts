import hangup from "@/core/hangup";
import {toast} from "react-hot-toast";

function dataChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("open", () => {
        console.log(`${dataChannel.label} channel is ready`);
    });

    dataChannel.addEventListener("error", (event) => {
        const errorEvent = event as RTCErrorEvent;
        console.log(errorEvent.error.message);
    });

    dataChannel.addEventListener("close", () => {
        // this is crucial if we want to inform the other peer that the call is ended ASAP
        if (dataChannel.label === "chat") {
            toast.error("ارتباط پایان یافت");
            hangup();
        }
        console.log(`${dataChannel.label} channel is closed`);
    });

}

export default dataChannelListeners;