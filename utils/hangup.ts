import {Peer} from "@/types";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";
import {peerActions} from "@/store";

function hangup({dispatch , peer}: {peer : Peer , dispatch: ThunkDispatch}) {

   const {peerConnection} = peer;

   if (!peerConnection) {
       return
   }

   peerConnection.close();

   dispatch(peerActions.setStatus(undefined));
   dispatch(peerActions.setCurrentRequest(undefined));
   dispatch(peerActions.setCurrentResponse(undefined));
   dispatch(peerActions.setPeerConnection(undefined));
   dispatch(peerActions.setOffer(undefined));
   dispatch(peerActions.setAnswer(undefined));
   dispatch(peerActions.setLocalStream(undefined));
   dispatch(peerActions.setRemoteStream(undefined));
   dispatch(peerActions.setLocalVideoRef(undefined));
   dispatch(peerActions.setRemoteVideoRef(undefined));
   dispatch(peerActions.setConnectionState(undefined));
   dispatch(peerActions.setSignallingState(undefined));
}

export default hangup
