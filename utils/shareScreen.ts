import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export async function shareScreen({dispatch, peer}: { dispatch: ThunkDispatch, peer: Peer }) {
    try {
        const {peerConnection ,localStream } = peer;

        const screenStream = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});
        dispatch(peerActions.setStatus("screen:send"));

        if (!localStream || !peerConnection) {
            return
        }

        const audioTrack = localStream.getAudioTracks().at(0);

        if (audioTrack) {
            screenStream.addTrack(audioTrack);
        }

        screenStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, screenStream);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        dispatch(peerActions.setLocalStream(screenStream));
        dispatch(peerActions.setPeerConnection(peerConnection));
        dispatch(peerActions.setOffer(offer));

        /*if (localVideoRef?.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }*/


    } catch (err) {
        console.log(err);
    }

}
