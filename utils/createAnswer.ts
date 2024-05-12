// @ts-ignore
import {ThunkDispatch} from "redux-thunk";
import {peerActions} from "@/store";
import {Peer, Request} from "@/types";

async function createAnswer({dispatch, peer, request}: { dispatch: ThunkDispatch, peer: Peer, request: Request }) {

    const {peerConnection} = peer

    await peerConnection?.setRemoteDescription(request.offer);
    const answer = await peerConnection?.createAnswer();
    request.iceCandidates.forEach(item => {
        peerConnection?.addIceCandidate(item);
    })
    await peerConnection?.setLocalDescription(answer);
    dispatch(peerActions.setPeerConnection(peerConnection));
    dispatch(peerActions.setStatus("receiveScreen"));
    dispatch(peerActions.setAnswer(answer));

    return answer;

}

export default createAnswer;