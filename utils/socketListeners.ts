import socketSignal from "@/signals/socket";
import {ConnectedPeer, Request, Response} from "@/types";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import {toast} from "react-toastify";
import currentResponseSignal from "@/signals/peer/currentResponse";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import connectedPeersSignal from "@/signals/peer/connectedPeers";

function socketListeners() {

    socketSignal.value?.on("requestToPeer", (request : Request) => {
        receivedRequestsSignal.value = [
            ...receivedRequestsSignal.value,
            request
        ]
        toast("یک درخواست دریافت شد");
    })
    socketSignal.value?.on("responseToPeer", async (response : Response ) => {
        try {
            currentResponseSignal.value = response;
            await peerConnectionSignal.value?.setRemoteDescription(response.answer);
            response.iceCandidates.forEach(item => {
                peerConnectionSignal.value?.addIceCandidate(item);
            })

        } catch (err) {
            console.error(err);
        }
    })
    socketSignal.value?.on("connectedPeers", ({connectedPeers} : {connectedPeers : ConnectedPeer[]}) => {
        connectedPeersSignal.value = connectedPeers;
    })
}

export default socketListeners;