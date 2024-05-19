// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {peerActions} from "@/store/peerSlice";

function createConnection({dispatch}: {dispatch: ThunkDispatch}) {

    const peerConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"]}]}
    const peerConnection = new RTCPeerConnection(peerConfig);

    dispatch(peerActions.setPeerConnection(peerConnection));

    return peerConnection;
}

export default createConnection;