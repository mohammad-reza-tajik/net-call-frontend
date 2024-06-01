import {fileChannelSignal} from "@/signals/peer/peerConnection";

const CHUNK_SIZE = 1024 * 16;

function sendInChunks(fileBuffer: ArrayBuffer) {
    let offset = 0;
    while (offset < fileBuffer.byteLength) {
        const chunk = fileBuffer.slice(offset, offset + CHUNK_SIZE);
        fileChannelSignal.value?.send(chunk);
        offset += CHUNK_SIZE;
    }
}

export default sendInChunks;