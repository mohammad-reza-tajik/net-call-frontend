import {peerActions} from "@/store";
// @ts-ignore
import {type ThunkDispatch} from "redux-thunk";
import {Peer} from "@/types";

export default async function videoCall({dispatch, peer} : {dispatch : ThunkDispatch , peer : Peer}) {
    try {
        const { peerConnection , localStream , localVideoRef} = peer;
        dispatch(peerActions.setStatus("video:send"));

        if (!localStream || !peerConnection) {
            return
        }

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        dispatch(peerActions.setLocalStream(localStream));
        dispatch(peerActions.setOffer(offer));
        dispatch(peerActions.setPeerConnection(peerConnection));

        if (localVideoRef?.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }

    } catch (err) {
        console.log(err);
    }

}