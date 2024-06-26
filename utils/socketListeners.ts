import type {IConnectedPeer, IRequest, IResponse} from "@/types";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import {toast} from "react-toastify";
import currentResponseSignal from "@/signals/peer/currentResponse";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import hangup from "@/utils/hangup";
import {Socket} from "socket.io-client";

function socketListeners(socket: Socket) {

    socket.on("requestToPeer", (request: IRequest) => {
        // check if a request from the same remote peer exists
        const requestIndex = receivedRequestsSignal.value.findIndex(receivedRequest => {
            return receivedRequest.localPeerId === request.localPeerId;
        })

        if (requestIndex >= 0) {
            receivedRequestsSignal.value = [
                ...receivedRequestsSignal.value.slice(0, requestIndex),
                request,
                ...receivedRequestsSignal.value.slice(requestIndex + 1)
            ]
        } else {
            receivedRequestsSignal.value = [
                ...receivedRequestsSignal.value,
                request
            ]
        }

        toast.info("یک درخواست دریافت شد");
    })
    socket.on("responseToPeer", async (response: IResponse) => {
        try {
            /**
             the following line ensures that we stop if we (the sender) have cancelled the call and received
             response from the remote peer
             */
            if (peerConnectionSignal.value?.signalingState === "stable") {
                return toast.info("کاربر درخواست خود را لغو کرد");
            }

            currentResponseSignal.value = response;
            await peerConnectionSignal.value?.setRemoteDescription(response.answer);
            response.iceCandidates.forEach(item => {
                peerConnectionSignal.value?.addIceCandidate(item);
            })

        } catch (err) {
            console.error(err);
        }
    })

    socket.on("connectedPeers", ({connectedPeers}: { connectedPeers: IConnectedPeer[] }) => {
        connectedPeersSignal.value = connectedPeers.filter(item => item.localPeerId !== localPeerIdSignal.value);
    })

    socket.on("remotePeerNotConnected", () => {
        toast.error("این کاربر آنلاین نیست");
        hangup();
    })

    socket.on("rejectToPeer", () => {
        toast.error("درخواست شما رد شد");
        if (peerConnectionSignal.value?.signalingState !== "stable") {
            hangup();
        }
    })
}

export default socketListeners;