import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export async function shareScreen({dispatch, peer} : {dispatch : ThunkDispatch , peer : Peer}) {
    try {
        const {  videoRef ,peerConnection} = peer;
        const myScreen = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});
        dispatch(peerActions.setStatus("screen:send"));
        myScreen.getTracks().forEach(track => {
            peerConnection?.addTrack(track, myScreen);
        });
        const offer = await peerConnection?.createOffer();
        await peerConnection?.setLocalDescription(offer);

        dispatch(peerActions.setStream(myScreen));
        dispatch(peerActions.setPeerConnection(peerConnection));
        dispatch(peerActions.setOffer(offer));

    } catch (err) {
        console.log(err);
    }

}
