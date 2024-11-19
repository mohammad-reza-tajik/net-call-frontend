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
import remoteStreamSignal from "@/signals/remoteStream";
import localVideoRefSignal from "@/signals/localVideoRef";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import haveNewMessageSignal from "@/signals/haveNewMessage";

function hangup() {

    chatChannelSignal.value?.close();
    peerConnectionSignal.value?.close();

    batch(() => {
        statusSignal.value = undefined;
        currentRequestSignal.value = undefined;
        messagesSignal.value = [];
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
        haveNewMessageSignal.value = false;
    });

    if (localVideoRefSignal.value?.current && remoteVideoRefSignal.value?.current) {
        localVideoRefSignal.value.current.srcObject = null;
        remoteVideoRefSignal.value.current.srcObject = null;
    }

    routerSignal.value?.push("/");
}

export default hangup;