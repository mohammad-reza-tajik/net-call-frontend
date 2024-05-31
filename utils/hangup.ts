import statusSignal from "@/signals/peer/status";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";

function hangup() {


   if (!peerConnectionSignal.value) {
      return
   }

   socketSignal.value?.emit("hangupToServer", {localPeerId : localPeerIdSignal.value , remotePeerId : remotePeerIdSignal.value});
   // peerConnectionSignal.value.close();

   statusSignal.value = undefined;
   // remote.value = undefined;
   // dispatch(peerActions.setRemoteStream(undefined));
   // dispatch(peerActions.setCurrentRequest(undefined));
   // dispatch(peerActions.setCurrentResponse(undefined));
   // dispatch(peerActions.setPeerConnection(undefined));
   // dispatch(peerActions.setOffer(undefined));
   // dispatch(peerActions.setAnswer(undefined));
   // dispatch(peerActions.setLocalStream(undefined));
   // dispatch(peerActions.setLocalVideoRef(undefined));
   // dispatch(peerActions.setRemoteVideoRef(undefined));
   // dispatch(peerActions.setConnectionState(undefined));
   // dispatch(peerActions.setSignallingState(undefined));
}

export default hangup
