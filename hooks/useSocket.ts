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
            dispatch(peerActions.addRequest(request));
            dispatch(peerActions.setSenderSocketId(request.socketId));
            toast("یک درخواست دریافت شد");
        })
        socket?.on("responseToPeer", async (response : Response ) => {
            try {
                console.log(response);
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