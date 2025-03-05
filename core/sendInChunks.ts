import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import type {IFileData, IFileMessage} from "@/types";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import messagesSignal from "@/signals/peer/messages";

const CHUNK_SIZE = 1024 * 256;

async function sendInChunks({fileBuffer, fileData}: { fileBuffer: ArrayBuffer, fileData: IFileData }) {
    const timestamp = new Date();
    let offset = 0;
    const dataChannel = peerConnectionSignal.value!.createDataChannel(`file:${fileData.name}__${localPeerIdSignal.value}__${Date.now()}`);
    /**
     transferringFileMessageIndex variable is the index of the file-message we're going to send . we know that
     it's going to be placed after the last element in the array so the index will be
     the last-index + 1 and it's equal to array.length
     */
    const transferringFileMessageIndex = messagesSignal.value.length;

    dataChannel.addEventListener("open", async () => {
        dataChannel.send(JSON.stringify(fileData));
        while (offset < fileBuffer.byteLength) {
            if (dataChannel.bufferedAmount <= CHUNK_SIZE) {
                const chunk = fileBuffer.slice(offset, Math.min(offset + CHUNK_SIZE, fileBuffer.byteLength));
                dataChannel.send(chunk);
                offset += CHUNK_SIZE;

                /**
                 show a temporary message that indicates that a file is being received
                 and with every chunk received it updates the transferredAmount
                 */

                const tempFileMessage: IFileMessage = {
                    file: fileData,
                    type: "file",
                    localPeerId: localPeerIdSignal.value,
                    transferredAmount: offset,
                    timestamp
                };

                messagesSignal.value = [
                    ...messagesSignal.value.slice(0, transferringFileMessageIndex),
                    tempFileMessage,
                    ...messagesSignal.value.slice(transferringFileMessageIndex + 1)
                ];

            } else {
                // Wait for the buffered amount to decrease before sending the next chunk
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
            const fileMessage: IFileMessage = {
                file: fileData,
                type: "file",
                localPeerId: localPeerIdSignal.value,
                transferredAmount: fileData.size,
                timestamp
            };

        messagesSignal.value = [
            ...messagesSignal.value.slice(0, transferringFileMessageIndex),
            fileMessage,
            ...messagesSignal.value.slice(transferringFileMessageIndex + 1)
        ];

    });
}

export default sendInChunks;
