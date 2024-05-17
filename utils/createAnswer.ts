import {Peer, Request, type Status} from "@/types";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";
import {peerActions} from "@/store";

async function createAnswer({dispatch, peer, request}: { dispatch: ThunkDispatch, peer: Peer, request: Request }) {

    const {peerConnection, localVideoRef , localStream} = peer;
    const answerStatus = request.status.split(":").at(0)!.concat(":receive") as Status;

    if (!peerConnection || !localStream) {
        return;
    }

    console.log("reached here")
    if (request.status === "audio:send" || request.status === "screen:send") {
        localStream.getAudioTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        })
    } else if (request.status === "video:send") {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        })
    }

    await peerConnection?.setRemoteDescription(request.offer);
    const answer = await peerConnection?.createAnswer();
    request.iceCandidates.forEach(item => {
        peerConnection?.addIceCandidate(item);
    })
    await peerConnection?.setLocalDescription(answer);

    dispatch(peerActions.setStatus(answerStatus));
    dispatch(peerActions.removeRequest(request));
    dispatch(peerActions.setLocalStream(localStream));
    dispatch(peerActions.setPeerConnection(peerConnection));
    dispatch(peerActions.setAnswer(answer));

    if (localVideoRef?.current && request.status === "video:send") {
        localVideoRef.current.srcObject = localStream;
    }

    return answer;

}

export default createAnswer;