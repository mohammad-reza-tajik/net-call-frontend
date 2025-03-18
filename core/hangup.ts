import {
  answerSignal,
  chatChannelSignal,
  connectionStateSignal,
  offerSignal,
  peerConnectionSignal,
  signalingStateSignal,
} from "@/signals/peer/peerConnection";
import statusSignal from "@/signals/peer/status";
import currentRequestSignal from "@/signals/peer/currentRequest";
import messagesSignal from "@/signals/peer/messages";
import { batch } from "@preact/signals-react";
import currentResponseSignal from "@/signals/peer/currentResponse";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import remoteStreamSignal from "@/signals/remoteStream";
import localVideoRefSignal from "@/signals/localVideoRef";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import haveNewMessageSignal from "@/signals/haveNewMessage";
import {
  diceSignal,
  gameChannelSignal,
  isGameOverSignal,
  isYourTurnSignal,
  myScoreSignal,
  opponentScoreSignal,
  temporaryScoreSignal,
} from "@/signals/games/pigGame";
import { isChatDrawerOpenSignal } from "@/signals/drawer";
import iceCandidatesSignal from "@/signals/peer/iceCandidates";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import removeConnection from "./removeConnection";

function hangup() {
  // Notify server
  if (socketSignal.value && localPeerIdSignal.value) {
    socketSignal.value.emit("hangupToServer", {
      localPeerId: localPeerIdSignal.value,
    });
  }

  removeConnection(peerConnectionSignal.value);

  batch(() => {
    statusSignal.value = undefined;
    peerConnectionSignal.value = undefined;
    currentRequestSignal.value = undefined;
    currentResponseSignal.value = undefined;
    isChatDrawerOpenSignal.value = false;
    messagesSignal.value = [];
    iceCandidatesSignal.value = [];
    offerSignal.value = undefined;
    answerSignal.value = undefined;
    remotePeerIdSignal.value = "";
    remoteStreamSignal.value = undefined;
    signalingStateSignal.value = undefined;
    connectionStateSignal.value = undefined;
    chatChannelSignal.value = undefined;
    gameChannelSignal.value = undefined;
    haveNewMessageSignal.value = false;
    diceSignal.value = 5;
    opponentScoreSignal.value = 0;
    myScoreSignal.value = 0;
    temporaryScoreSignal.value = 0;
    isYourTurnSignal.value = false;
    isGameOverSignal.value = false;
  });

  if (localVideoRefSignal.value?.current && remoteVideoRefSignal.value?.current) {
    localVideoRefSignal.value.current.srcObject = null;
    remoteVideoRefSignal.value.current.srcObject = null;
  }
}

export default hangup;
