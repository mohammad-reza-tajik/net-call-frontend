import {
    peerConnectionSignal,
    connectionStateSignal,
    offerSignal,
    signalingStateSignal,
    answerSignal
} from "@/signals/peer/peerConnection";
import {toast} from "react-toastify";
import remoteStreamSignal from "@/signals/remoteStream";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import statusSignal from "@/signals/peer/status";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";

function peerConnectionListeners() {

    if (!peerConnectionSignal.value) return;
    const iceCandidates: RTCIceCandidate[] = [];

    let candidateTimeout: NodeJS.Timeout | undefined;
    peerConnectionSignal.value.addEventListener("icecandidate", (event) => {
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

    peerConnectionSignal.value.addEventListener("signalingstatechange", () => {
        signalingStateSignal.value = peerConnectionSignal.value?.signalingState;
    })

    peerConnectionSignal.value.addEventListener("connectionstatechange", () => {
        connectionStateSignal.value = peerConnectionSignal.value?.connectionState;
        let toastId: number | string;

        if (peerConnectionSignal.value!.connectionState === "connecting") {
            toastId = toast.loading("در حال اتصال ...");
        } else if (peerConnectionSignal.value!.connectionState === "connected") {
            toast.dismiss(toastId!);
            toast.success("متصل شدید");
        } else if (peerConnectionSignal.value!.connectionState === "disconnected") {
            toast.error("ارتباط قطع شد");
        }
    })

    peerConnectionSignal.value.addEventListener("track", (event) => {
        remoteStreamSignal.value = event.streams.at(0);
        if (remoteVideoRefSignal.value?.current && remoteStreamSignal.value) {
            remoteVideoRefSignal.value.current.srcObject = remoteStreamSignal.value;
        }
    })
}

export default peerConnectionListeners;