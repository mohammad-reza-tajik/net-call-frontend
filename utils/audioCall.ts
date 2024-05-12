import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export default async function audioCall({dispatch, peer} : {dispatch : ThunkDispatch , peer : Peer}) {
    try {
        dispatch(peerActions.setStatus("audio:send"));
        const { peerConnection} = peer;
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
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