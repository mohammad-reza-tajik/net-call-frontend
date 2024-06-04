import type {IFileData, IFileMessage} from "@/types";
import remotePeerId from "@/signals/peer/remotePeerId";
import messagesSignal from "@/signals/peer/messages";
import {fileChannelSignal} from "@/signals/peer/peerConnection";

const CHUNK_SIZE = 1024 * 256;

function fileChannelListeners(dataChannel : RTCDataChannel) {

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
            id: dataChannel.label,
            file: fileData,
            type: "file",
            localPeerId: remotePeerId.value,
            transferredAmount: receivedChunks.length * CHUNK_SIZE
        }

        /**
         show a temporary message that indicates that a file is being received
         and with every chunk received it updates the transferredAmount
         */

        const transferringFileMessage = messagesSignal.value.findLastIndex((message)=> message.id === dataChannel.label);
        console.log(transferringFileMessage , messagesSignal.value);

        const lastMessage = messagesSignal.value.at(-1);

        if (lastMessage && "file" in lastMessage && lastMessage.file.name === fileData.name) {
            messagesSignal.value = [...messagesSignal.value.slice(0, -1), tempFileMessage];
        } else {
            messagesSignal.value = [...messagesSignal.value, tempFileMessage];
        }

        if (receivedChunks.length * CHUNK_SIZE >= fileData.size) {

            console.log("file received");
            dataChannel.close();

            const file = new File(receivedChunks, fileData.name, {type: fileData.mimeType});

            const fileMessage: IFileMessage = {
                id: dataChannel.label,
                file,
                type: "file",
                localPeerId: remotePeerId.value,
                transferredAmount: file.size
            }

            messagesSignal.value = [...messagesSignal.value.slice(0, -1), fileMessage];

            fileData = undefined;
            receivedChunks = [];
        }
    })

    fileChannelSignal.value = dataChannel;
}

export default fileChannelListeners;