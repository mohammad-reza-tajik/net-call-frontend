import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export default async function videoCall({dispatch, peer} : {dispatch : ThunkDispatch , peer : Peer}) {
    try {
        dispatch(peerActions.setStatus("video:send"));
        const { peerConnection} = peer;
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        stream.getTracks().forEach(track => {
            peerConnection?.addTrack(track, stream);
        });
        const offer = await peerConnection?.createOffer();
        await peerConnection?.setLocalDescription(offer);

        dispatch(peerActions.setStream(stream));
        dispatch(peerActions.setPeerConnection(peerConnection));
        dispatch(peerActions.setOffer(offer));

    } catch (err) {
        console.log(err);
    }

}