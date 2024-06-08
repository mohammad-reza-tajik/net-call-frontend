import socketSignal from "@/signals/socket";
import type {IConnectedPeer, IRequest, IResponse} from "@/types";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import {toast} from "react-toastify";
import currentResponseSignal from "@/signals/peer/currentResponse";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import hangup from "@/utils/hangup";

function socketListeners() {

    socketSignal.value?.on("requestToPeer", (request : IRequest) => {
        receivedRequestsSignal.value = [
            ...receivedRequestsSignal.value,
            request
        ]
        toast.info("یک درخواست دریافت شد");
    })
    socketSignal.value?.on("responseToPeer", async (response : IResponse ) => {
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

    socketSignal.value?.on("connectedPeers", ({connectedPeers}: { connectedPeers: IConnectedPeer[] }) => {
        connectedPeersSignal.value = connectedPeers.filter(item => item.localPeerId !== localPeerIdSignal.value);
    })

    socketSignal.value?.on("remotePeerNotConnected",()=>{
        toast.error("این کاربر آنلاین نیست");
        hangup();
    })

    socketSignal.value?.on("rejectToPeer",()=>{
        toast.error("درخواست شما رد شد");
        hangup();
    })
}

export default socketListeners;