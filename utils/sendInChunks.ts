import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import type {IFileData, IFileMessage} from "@/types";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import messagesSignal from "@/signals/peer/messages";

const CHUNK_SIZE = 1024 * 256;

async function sendInChunks({fileBuffer, fileData}: { fileBuffer: ArrayBuffer, fileData: IFileData }) {
    let offset = 0;
    const dataChannel = peerConnectionSignal.value!.createDataChannel(`file:${fileData.name}`);

    // Start sending chunks
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
                    transferredAmount: offset
                }

                const lastMessage = messagesSignal.value.at(-1);

                if (lastMessage && "file" in lastMessage && lastMessage.file.name === fileData.name) {
                    messagesSignal.value = [...messagesSignal.value.slice(0,-1), tempFileMessage];
                } else {
                    messagesSignal.value = [...messagesSignal.value, tempFileMessage];
                }

            } else {
                // Wait for the buffered amount to decrease before sending the next chunk
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
            const fileMessage: IFileMessage = {
                file: fileData,
                type: "file",
                localPeerId: localPeerIdSignal.value,
                transferredAmount: fileData.size
            }
            messagesSignal.value = [...messagesSignal.value.slice(0, -1), fileMessage];
    })
}

export default sendInChunks;
