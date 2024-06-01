import {chatChannelSignal, fileChannelSignal} from "@/signals/peer/peerConnection";
import messagesSignal from "@/signals/peer/messages";
import type {IFileData, IFileMessage} from "@/types";
import remotePeerId from "@/signals/peer/remotePeerId";
import transferredAmount from "@/signals/transferredAmount";

const CHUNK_SIZE = 1024 * 64;

function dataChannelListeners(dataChannel: RTCDataChannel) {
    dataChannel.addEventListener("open", () => {
        console.log(`${dataChannel.label} channel is ready`)
    })

    dataChannel.addEventListener("error", (event) => {
        const errorEvent = event as RTCErrorEvent;
        console.log(errorEvent.error.message);
    })

    if (dataChannel.label === "chat") {
        dataChannel.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            messagesSignal.value = [...messagesSignal.value, message];
        })

        chatChannelSignal.value = dataChannel;
    } else {
        let fileData: IFileData | undefined = undefined;
        let receivedChunks: ArrayBuffer[] = [];

        dataChannel.bufferedAmountLowThreshold = CHUNK_SIZE;

        dataChannel.addEventListener("message", ({data}) => {

            if (typeof data === "string") {
                fileData = JSON.parse(data);
            } else {
                receivedChunks.push(data);
            }

            if (!fileData) return;

            transferredAmount.value = receivedChunks.length * CHUNK_SIZE;

            if (receivedChunks.length * CHUNK_SIZE >= fileData.size) {
                console.log("file received");

                const file = new File(receivedChunks, fileData.name, {type: fileData.mimeType});

                const fileMessage: IFileMessage = {
                    file,
                    type: "file",
                    localPeerId: remotePeerId.value,
                }

                messagesSignal.value = [...messagesSignal.value, fileMessage];

                fileData = undefined;
                receivedChunks = [];
            }
        })

        fileChannelSignal.value = dataChannel;
    }

}

export default dataChannelListeners;