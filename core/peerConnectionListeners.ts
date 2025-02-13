import {
    connectionStateSignal, offerSignal, signalingStateSignal, answerSignal, peerConnectionSignal
} from "@/signals/peer/peerConnection";
import {toast} from "react-hot-toast";
import remoteStreamSignal from "@/signals/remoteStream";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import statusSignal from "@/signals/peer/status";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import dataChannelListeners from "@/core/dataChannelListeners";
import chatChannelListeners from "@/core/chatChannelListeners";
import fileChannelListeners from "@/core/fileChannelListeners";
import hangup from "@/core/hangup";
import gameChannelListeners from "@/core/gameChannelListeners";
import showNotification from "@/lib/utils/showNotification";

function peerConnectionListeners(peerConnection: RTCPeerConnection) {

    const iceCandidates: RTCIceCandidate[] = [];

    let candidateTimeout: NodeJS.Timeout;

    peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
            iceCandidates.push(event.candidate);

            if (iceCandidates.length > 0 && offerSignal.value && statusSignal.value?.endsWith(":send")) {

                if (candidateTimeout) {
                    clearTimeout(candidateTimeout);
                }

                candidateTimeout = setTimeout(() => {
                    socketSignal.value?.emit("requestToServer", {
                        iceCandidates: iceCandidates,
                        offer: offerSignal.value,
                        localPeerId: localPeerIdSignal.value,
                        remotePeerId: remotePeerIdSignal.value,
                        status: statusSignal.value,
                        socketId: socketSignal.value?.id
                    });
                }, 1000)
            }
            if (iceCandidates.length > 0 && answerSignal.value && statusSignal.value?.endsWith(":receive")) {

                clearTimeout(candidateTimeout);

                candidateTimeout = setTimeout(() => {
                    socketSignal.value?.emit("responseToServer", {
                        iceCandidates: iceCandidates,
                        answer: answerSignal.value,
                        localPeerId: localPeerIdSignal.value,
                        remotePeerId: remotePeerIdSignal.value,
                        status: statusSignal.value,
                        socketId: socketSignal.value?.id
                    });
                }, 1000)
            }
        }
    });

    peerConnection.addEventListener("signalingstatechange", () => {
        signalingStateSignal.value = peerConnection.signalingState;
    })

    peerConnection.addEventListener("connectionstatechange", () => {
        connectionStateSignal.value = peerConnection.connectionState;

        if (peerConnection.connectionState === "connected") {
            toast.success("متصل شدید");
            showNotification({
                title : `با موفقیت به ${remotePeerIdSignal.value} متصل شدید `,

            })
        } else if (peerConnection.connectionState === "failed") {
            hangup();
            toast.error("متاسفانه ارتباط برقرار نشد");
        }
    })

    peerConnection.addEventListener("track", (event) => {
        remoteStreamSignal.value = event.streams.at(0);
        if (remoteVideoRefSignal.value?.current && remoteStreamSignal.value) {
            remoteVideoRefSignal.value.current.srcObject = remoteStreamSignal.value;
        }
    })

    peerConnection.addEventListener("datachannel", ({channel}) => {
        dataChannelListeners(channel);
        if (channel.label === "chat") {
            chatChannelListeners(channel);
        } else if (channel.label.startsWith("file")) {
            fileChannelListeners(channel);
        } else if (channel.label === "game"){
            gameChannelListeners(channel);
        }
    })

    peerConnectionSignal.value = peerConnection;
}

export default peerConnectionListeners;