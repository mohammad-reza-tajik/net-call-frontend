import { fileChannelSignal } from "@/signals/peer/peerConnection";
import transferredAmount from "@/signals/transferredAmount";

const CHUNK_SIZE = 1024 * 64;

async function sendInChunks(fileBuffer : ArrayBuffer) {
    let offset = 0;
    const channel = fileChannelSignal.value;

    // Function to send a chunk of data
    async function sendChunk() {
        while (channel && offset < fileBuffer.byteLength) {
            if (channel.bufferedAmount <= CHUNK_SIZE) {
                const chunk = fileBuffer.slice(offset, Math.min(offset + CHUNK_SIZE, fileBuffer.byteLength));
                channel.send(chunk);
                offset += CHUNK_SIZE;
                transferredAmount.value = offset;
            } else {
                // Wait for the buffered amount to decrease before sending the next chunk
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

    // Start sending chunks
    await sendChunk();
}

export default sendInChunks;
