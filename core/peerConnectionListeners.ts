import { connectionStateSignal, peerConnectionSignal, signalingStateSignal } from "@/signals/peer/peerConnection";
import { toast } from "react-hot-toast";
import remoteStreamSignal from "@/signals/remoteStream";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import dataChannelListeners from "@/core/dataChannelListeners";
import chatChannelListeners from "@/core/chatChannelListeners";
import fileChannelListeners from "@/core/fileChannelListeners";
import gameChannelListeners from "@/core/gameChannelListeners";
import showNotification from "@/lib/utils/showNotification";
import iceCandidatesSignal from "@/signals/peer/iceCandidates";

function peerConnectionListeners(peerConnection: RTCPeerConnection) {
    let iceCandidates: RTCIceCandidate[] = [];

    peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate !== null) {
            iceCandidates.push(event.candidate);
        } else {
            // when event.candidate is null it means that all candidates have been gathered
            if (iceCandidates.length === 0) {
                toast.error("no candidates found");
                throw new Error("No candidates found");
            }

            iceCandidatesSignal.value = iceCandidates;
            iceCandidates = [];
        }
    });

    peerConnection.addEventListener("signalingstatechange", () => {
        signalingStateSignal.value = peerConnection.signalingState;
    });

    peerConnection.addEventListener("connectionstatechange", () => {
        connectionStateSignal.value = peerConnection.connectionState;

        if (peerConnection.connectionState === "connected") {
            toast.success("متصل شدید");
            showNotification({
                title: `با موفقیت به ${remotePeerIdSignal.value} متصل شدید `,
            });
        } else if (peerConnection.connectionState === "failed") {
            if (peerConnectionSignal.value?.signalingState !== "stable") {
                peerConnectionSignal.value?.close();
                toast.error("متاسفانه ارتباط برقرار نشد");
            }
        }
    });

    peerConnection.addEventListener("track", (event) => {
        remoteStreamSignal.value = event.streams.at(0);
        if (remoteVideoRefSignal.value?.current && remoteStreamSignal.value) {
            remoteVideoRefSignal.value.current.srcObject = remoteStreamSignal.value;
        }
    });

    peerConnection.addEventListener("datachannel", ({ channel }) => {
        dataChannelListeners(channel);
        if (channel.label === "chat") {
            chatChannelListeners(channel);
        } else if (channel.label.startsWith("file")) {
            fileChannelListeners(channel);
        } else if (channel.label === "game") {
            gameChannelListeners(channel);
        }
    });

    peerConnectionSignal.value = peerConnection;
}

export default peerConnectionListeners;
