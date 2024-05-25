import {useEffect} from "react";
import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import {Response, Request, ConnectedPeer} from "@/types";
import {toast} from "react-toastify";

function useSocket() {

    const dispatch = useAppDispatch();
    const {peerConnection , socket} = useAppSelector(state => state.peer);

    useEffect(() => {
        socket?.on("requestToPeer", async (request : Request) => {
            try {
                dispatch(peerActions.addRequest(request));
                toast("یک درخواست دریافت شد");
            } catch (err) {
                console.error(err);
            }
        })
        socket?.on("responseToPeer", async (response : Response ) => {
            try {
                dispatch(peerActions.setCurrentResponse(response));
                await peerConnection?.setRemoteDescription(response.answer);
                response.iceCandidates.forEach(item => {
                    peerConnection?.addIceCandidate(item);
                })

            } catch (err) {
                console.error(err);
            }
        })
        socket?.on("connectedPeers", ({connectedPeers} : {connectedPeers : ConnectedPeer[]}) => {
            dispatch(peerActions.setConnectedPeers(connectedPeers));
        })
    }, [socket]);

}

export default useSocket;