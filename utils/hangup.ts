import {
    answerSignal, chatChannelSignal,
    connectionStateSignal, fileChannelSignal,
    offerSignal,
    peerConnectionSignal,
    signalingStateSignal
} from "@/signals/peer/peerConnection";
import statusSignal from "@/signals/peer/status";
import routerSignal from "@/signals/router";
import currentRequestSignal from "@/signals/peer/currentRequest";
import messagesSignal from "@/signals/peer/messages";
import {batch} from "@preact/signals-react";
import currentResponseSignal from "@/signals/peer/currentResponse";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import devicesSignal from "@/signals/devices";
import remoteStreamSignal from "@/signals/remoteStream";

function hangup() {

    peerConnectionSignal.value?.close();
    batch(() => {
        statusSignal.value = undefined;
        currentRequestSignal.value = undefined;
        messagesSignal.value = [];
        devicesSignal.value = undefined;
        offerSignal.value = undefined;
        answerSignal.value = undefined;
        currentResponseSignal.value = undefined;
        peerConnectionSignal.value = undefined;
        remotePeerIdSignal.value = "";
        remoteStreamSignal.value = undefined;
        signalingStateSignal.value = undefined;
        connectionStateSignal.value = undefined;
        chatChannelSignal.value = undefined;
        fileChannelSignal.value = undefined;
    });
    routerSignal.value?.push("/");
}

export default hangup;