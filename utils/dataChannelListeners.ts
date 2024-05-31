import {chatChannelSignal, fileChannelSignal} from "@/signals/peer/peerConnection";
import messagesSignal from "@/signals/peer/messages";
import type {IFileData, IFileMessage} from "@/types";
import remotePeerId from "@/signals/peer/remotePeerId";

function dataChannelListeners(dataChannel: RTCDataChannel) {
    dataChannel.addEventListener("open", () => {
        console.log(`${dataChannel.label} channel is ready`)
    })

    if (dataChannel.label === "chat") {
        dataChannel.addEventListener("message", (event) => {
            const message = JSON.parse(event.data);
            messagesSignal.value = [...messagesSignal.value, message];
        })

        chatChannelSignal.value = dataChannel;
    } else {
        let fileData : IFileData | undefined = undefined, fileBuffer : ArrayBuffer | undefined = undefined;
        dataChannel.addEventListener("message", ({data}) => {

            if (typeof data === "string") {
                fileData = JSON.parse(data);
            } else {
                fileBuffer = data;
            }

            if (!fileData || !fileBuffer) return;

             const blob = new Blob([fileBuffer]);

             // Create a File from the Blob
             const file = new File([blob] , fileData.name , {type : fileData.mimeType});

            console.log("file received");

            const fileMessage : IFileMessage = {
                file,
                type : "file",
                localPeerId : remotePeerId.value,
            }

            messagesSignal.value = [...messagesSignal.value, fileMessage];
        })

        fileChannelSignal.value = dataChannel;
    }

}

export default dataChannelListeners;