import {useEffect} from "react";
import {Response, Request, ConnectedPeer} from "@/types";
import {toast} from "react-toastify";
import receivedRequestsSignal from "@/signals/receivedRequests";
import socketSignal from "@/signals/socket";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import currentResponseSignal from "@/signals/currentResponse";
import peerConnectionSignal from "@/signals/peer/peerConnection";

function useSocket() {

    useEffect(() => {
        socketSignal.value.on("requestToPeer", (request : Request) => {
                receivedRequestsSignal.value = [
                    ...receivedRequestsSignal.value,
                    request
                ]
                toast("یک درخواست دریافت شد");
        })
        socketSignal.value.on("responseToPeer", async (response : Response ) => {
            try {
                currentResponseSignal.value = response;
                await peerConnectionSignal.value.setRemoteDescription(response.answer);
                response.iceCandidates.forEach(item => {
                    peerConnectionSignal.value.addIceCandidate(item);
                })

            } catch (err) {
                console.error(err);
            }
        })
        socketSignal.value.on("connectedPeers", ({connectedPeers} : {connectedPeers : ConnectedPeer[]}) => {
            connectedPeersSignal.value = connectedPeers;
        })
    }, []);

}

export default useSocket;