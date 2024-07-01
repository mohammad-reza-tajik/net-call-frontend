import {toast} from "react-hot-toast";
import hangup from "@/utils/hangup";

function dataChannelListeners(dataChannel: RTCDataChannel) {

    dataChannel.addEventListener("open", () => {
        console.log(`${dataChannel.label} channel is ready`);
    })

    dataChannel.addEventListener("error", (event) => {
        const errorEvent = event as RTCErrorEvent;
        console.log(errorEvent.error.message);
    })

    dataChannel.addEventListener("close", () => {
        if (dataChannel.label === "chat") {
            toast.error("ارتباط پایان یافت");
            hangup();
        }
        console.log(`${dataChannel.label} channel is closed`);
    })

}

export default dataChannelListeners;