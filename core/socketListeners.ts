import type {IConnectedPeer, IRequest, IResponse} from "@/types";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import {toast} from "react-hot-toast";
import currentResponseSignal from "@/signals/peer/currentResponse";
import {chatChannelSignal, peerConnectionSignal} from "@/signals/peer/peerConnection";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import hangup from "@/core/hangup";
import type {Socket} from "socket.io-client";
import {isRequestsDrawerOpenSignal} from "@/signals/drawer";
import haveNewRequestSignal from "@/signals/haveNewRequest";
import showNotification from "@/lib/utils/showNotification";

function socketListeners(socket: Socket) {

    socket.on("requestToPeer", (request: IRequest) => {
        // check if a request from the same remote peer exists and replace them with new one
        const requestIndex = receivedRequestsSignal.value.findIndex(receivedRequest => {
            return receivedRequest.localPeerId === request.localPeerId;
        });

        if (requestIndex >= 0) {
            receivedRequestsSignal.value = [
                ...receivedRequestsSignal.value.slice(0, requestIndex),
                request,
                ...receivedRequestsSignal.value.slice(requestIndex + 1)
            ];
        } else {
            receivedRequestsSignal.value = [
                ...receivedRequestsSignal.value,
                request
            ];
        }

        let statusText: string | undefined;

        if (request.status === "screen:send") {
            statusText = "اشتراک گذاری صفحه";
        } else if (request.status === "video:send") {
            statusText = "تماس تصویری";
        } else if (request.status === "audio:send") {
            statusText = "تماس صوتی";
        } else if (request.status === "game:send") {
            statusText = "بازی";
        }

        showNotification({
            title: "یک درخواست دریافت شد",
            body: `${request.localPeerId} شما را به  ${statusText} دعوت کرد `,
        });

        toast("یک درخواست دریافت شد");

        if (!isRequestsDrawerOpenSignal.value) {
            haveNewRequestSignal.value = true;
        }
    });

    socket.on("responseToPeer", async (response: IResponse) => {
        try {
            /**
             the following line ensures that we stop if we (the sender) have cancelled the call and received
             response from the remote peer
             */
            if (peerConnectionSignal.value?.signalingState === "stable") {
                return;
            }

            currentResponseSignal.value = response;
            await peerConnectionSignal.value?.setRemoteDescription(response.answer);
            response.iceCandidates.forEach(item => {
                peerConnectionSignal.value?.addIceCandidate(item);
            });

        } catch (err) {
            console.error(err);
        }
    });

    socket.on("connectedPeers", ({connectedPeers}: { connectedPeers: IConnectedPeer[] }) => {
        connectedPeersSignal.value = connectedPeers.filter(item => item.localPeerId !== localPeerIdSignal.value);
    });

    socket.on("remotePeerNotConnected", () => {
        toast.error("این کاربر آنلاین نیست");
        if(chatChannelSignal.value) {
            chatChannelSignal.value.close();
        } else {
            hangup();
        }

    });

    socket.on("hangupToPeer", () => {
        if (peerConnectionSignal.value?.signalingState !== "stable") {
            if(chatChannelSignal.value) {
                chatChannelSignal.value.close();
            } else {
                hangup();
            }

        }
    });

    socket.on("rejectToPeer", () => {
        toast.error("درخواست شما رد شد");
        showNotification({
            title: "درخواست شما رد شد",
        });
        /*
        if we're still waiting for the response hangup but if we are on another connection with another peer just ignore
        */
        if (peerConnectionSignal.value?.signalingState !== "stable") {
            if(chatChannelSignal.value) {
                chatChannelSignal.value.close();
            } else {
                hangup();
            }
            
        }
    });
}

export default socketListeners;