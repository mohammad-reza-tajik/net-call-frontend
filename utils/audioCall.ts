import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export default async function audioCall({dispatch, peer}: { dispatch: ThunkDispatch, peer: Peer }) {
    try {
        const {peerConnection , localStream  } = peer;
        dispatch(peerActions.setStatus("audio:send"));

        if (!localStream || !peerConnection){
            return
        }

        localStream.getAudioTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        dispatch(peerActions.setLocalStream(localStream));
        dispatch(peerActions.setPeerConnection(peerConnection));
        dispatch(peerActions.setOffer(offer));

        /*if (localVideoRef?.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }*/

    } catch (err) {
        console.log(err);
    }

}