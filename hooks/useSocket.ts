import {useEffect} from "react";
import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import {Peer} from "@/types";
import {Socket} from "socket.io-client";

function useSocket(socket? : Socket) {

    const dispatch = useAppDispatch();

    useEffect(() => {
        socket?.on("offerToPeer", async (offer) => {
            dispatch(peerActions.addRequest(offer));
        })
        socket?.on("answerToPeer", async (answer) => {
            console.log(answer);
        })
    }, [socket]);

}

export default useSocket;