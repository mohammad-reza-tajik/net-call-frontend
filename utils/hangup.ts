import {Peer} from "@/types";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";
import {peerActions} from "@/store";

function hangup({dispatch , peer}: {peer : Peer , dispatch: ThunkDispatch}) {
   console.log("Hangup");
   const {peerConnection} = peer;

   if (!peerConnection) {
       return
   }

   peerConnection.close();
   dispatch(peerActions.setStatus(undefined));
   dispatch(peerActions.setPeerConnection(peerConnection));
}

export default hangup
