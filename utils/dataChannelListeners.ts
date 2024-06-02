import {chatChannelSignal, fileChannelSignal} from "@/signals/peer/peerConnection";
import messagesSignal from "@/signals/peer/messages";
import type {IFileData, IFileMessage} from "@/types";
import remotePeerId from "@/signals/peer/remotePeerId";
import transferredAmount from "@/signals/transferredAmount";
import FileMessage from "@/components/connectPage/FileMessage";

const CHUNK_SIZE = 1024 * 256;

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

            const tempFileMessage: IFileMessage = {
                file: fileData,
                type: "file",
                localPeerId: remotePeerId.value,
                transferredAmount: receivedChunks.length * CHUNK_SIZE
            }

            /**
             show a temporary message that indicates that a file is being received
             and with every chunk received it updates the transferredAmount
             */
            const lastMessage = messagesSignal.value.at(-1);

            if (lastMessage && "file" in lastMessage && lastMessage.file.name === fileData.name) {
                messagesSignal.value = [...messagesSignal.value.slice(0,-1), tempFileMessage];
            } else {
                messagesSignal.value = [...messagesSignal.value, tempFileMessage];
            }

            if (receivedChunks.length * CHUNK_SIZE >= fileData.size) {

                console.log("file received");

                const file = new File(receivedChunks, fileData.name, {type: fileData.mimeType});

                const fileMessage: IFileMessage = {
                    file,
                    type: "file",
                    localPeerId: remotePeerId.value,
                    transferredAmount: file.size
                }

                messagesSignal.value = [...messagesSignal.value.slice(0,-1), fileMessage];

                fileData = undefined;
                receivedChunks = [];
            }
        })

        fileChannelSignal.value = dataChannel;
    }

}

export default dataChannelListeners;