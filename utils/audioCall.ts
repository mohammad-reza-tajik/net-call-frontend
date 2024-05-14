import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export default async function audioCall({dispatch, peer}: { dispatch: ThunkDispatch, peer: Peer }) {
    try {
        const {peerConnection , localVideoRef , localStream} = peer;
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        dispatch(peerActions.setStatus("audio:send"));
        stream.getTracks().forEach(track => {
            peerConnection?.addTrack(track, stream);
        });
        const offer = await peerConnection?.createOffer();
        await peerConnection?.setLocalDescription(offer);

        dispatch(peerActions.setLocalStream(stream));
        dispatch(peerActions.setPeerConnection(peerConnection));
        dispatch(peerActions.setOffer(offer));

        if (localVideoRef?.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }

    } catch (err) {
        console.log(err);
    }

}