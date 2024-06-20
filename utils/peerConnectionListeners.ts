import {
    connectionStateSignal, offerSignal, signalingStateSignal, answerSignal, peerConnectionSignal
} from "@/signals/peer/peerConnection";
import {toast} from "react-toastify";
import remoteStreamSignal from "@/signals/remoteStream";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import statusSignal from "@/signals/peer/status";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import dataChannelListeners from "@/utils/dataChannelListeners";
import chatChannelListeners from "@/utils/chatChannelListeners";
import fileChannelListeners from "@/utils/fileChannelListeners";

function peerConnectionListeners(peerConnection: RTCPeerConnection) {

    const iceCandidates: RTCIceCandidate[] = [];

    let candidateTimeout: NodeJS.Timeout | undefined;

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

                if (candidateTimeout) {
                    clearTimeout(candidateTimeout);
                }

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
        } else {
            fileChannelListeners(channel);
        }
    })

    peerConnectionSignal.value = peerConnection;
}

export default peerConnectionListeners;