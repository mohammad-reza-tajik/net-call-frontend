import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export async function shareScreen({dispatch, peer}: { dispatch: ThunkDispatch, peer: Peer }) {
    try {
        const {peerConnection} = peer;

        const audioStream = await navigator.mediaDevices.getUserMedia({audio: true});
        const screenStream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});
        dispatch(peerActions.setStatus("screen:send"));

        const audioTrack = audioStream.getAudioTracks().at(0);

        if (audioTrack) {
            screenStream.addTrack(audioTrack!)

        }

        screenStream.getTracks().forEach(track => {
            peerConnection?.addTrack(track, screenStream);
        });

        const offer = await peerConnection?.createOffer();
        await peerConnection?.setLocalDescription(offer);

        dispatch(peerActions.setStream(screenStream));
        dispatch(peerActions.setPeerConnection(peerConnection));
        dispatch(peerActions.setOffer(offer));

    } catch (err) {
        console.log(err);
    }

}
