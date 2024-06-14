import type {IFileData, IFileMessage} from "@/types";
import remotePeerId from "@/signals/peer/remotePeerId";
import messagesSignal from "@/signals/peer/messages";
import {chatChannelSignal, fileChannelSignal} from "@/signals/peer/peerConnection";
import {isChatDrawerOpenSignal} from "@/signals/drawer";

const CHUNK_SIZE = 1024 * 256;

function fileChannelListeners(dataChannel: RTCDataChannel) {

    let fileData: IFileData | undefined = undefined;
    let receivedChunks: ArrayBuffer[] = [];

    /**
     transferringFileMessageIndex variable is the index of the file-message we're going to send . we know that
     it's going to be placed after the last element in the array so the index will be
     the last-index + 1 and it's equal to array.length
     */
    const transferringFileMessageIndex = messagesSignal.value.length;

    dataChannel.bufferedAmountLowThreshold = CHUNK_SIZE;

    dataChannel.addEventListener("message", ({data}) => {

        if (typeof data === "string") {
            fileData = JSON.parse(data);
        } else {
            receivedChunks.push(data);
        }

        if (!fileData) return;

        /**
         show a temporary message that indicates that a file is being received
         and with every chunk received it updates the transferredAmount
         */

        const tempFileMessage: IFileMessage = {
            file: fileData,
            type: "file",
            localPeerId: remotePeerId.value,
            transferredAmount: receivedChunks.length * CHUNK_SIZE
        }

        messagesSignal.value = [...messagesSignal.value.slice(0, transferringFileMessageIndex), tempFileMessage, ...messagesSignal.value.slice(transferringFileMessageIndex + 1)];

        if (receivedChunks.length * CHUNK_SIZE >= fileData.size) {

            console.log("file received");

            if (isChatDrawerOpenSignal.value) {
                chatChannelSignal.value?.send("seen");
            }
            
            dataChannel.close();

            const file = new File(receivedChunks, fileData.name, {type: fileData.mimeType});

            const fileMessage: IFileMessage = {
                file,
                type: "file",
                localPeerId: remotePeerId.value,
                transferredAmount: file.size
            }

            messagesSignal.value = [...messagesSignal.value.slice(0, transferringFileMessageIndex), fileMessage, ...messagesSignal.value.slice(transferringFileMessageIndex + 1)];

            fileData = undefined;
            receivedChunks = [];
        }
    })

    fileChannelSignal.value = dataChannel;
}

export default fileChannelListeners;