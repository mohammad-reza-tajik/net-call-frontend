import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export default async function videoCall({dispatch, peer} : {dispatch : ThunkDispatch , peer : Peer}) {
    try {
        const { peerConnection , localStream , localVideoRef} = peer;
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        dispatch(peerActions.setStatus("video:send"));
        stream.getTracks().forEach(track => {
            peerConnection?.addTrack(track, stream);
        });
        const offer = await peerConnection?.createOffer();
        await peerConnection?.setLocalDescription(offer);

        dispatch(peerActions.setLocalStream(stream));
        dispatch(peerActions.setOffer(offer));
        dispatch(peerActions.setPeerConnection(peerConnection));

        if (localVideoRef?.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }

    } catch (err) {
        console.log(err);
    }

}