import {useEffect} from "react";
import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import {Socket} from "socket.io-client";
import {Response , Request} from "@/types";
import {toast} from "react-toastify";

function useSocket(socket? : Socket) {

    const dispatch = useAppDispatch();
    const peerConnection = useAppSelector(state => state.peer.peerConnection);

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
    }, [socket]);

}

export default useSocket;