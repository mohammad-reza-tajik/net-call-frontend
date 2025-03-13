"use client";
import type { IRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Thumb } from "@/components/shared/Icons";
import buildURL from "@/lib/utils/buildURL";
import currentRequestSignal from "@/signals/peer/currentRequest";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import routerSignal from "@/signals/router";
import socketSignal from "@/signals/socket";
import hangup from "@/core/hangup";
import { batch } from "@preact/signals-react";
import { isRequestsDrawerOpenSignal } from "@/signals/drawer";
import { peerConnectionSignal } from "@/signals/peer/peerConnection";
import friendsSignal from "@/signals/peer/friends";

interface IRequestItemProps {
    request: IRequest;
}

function RequestItem({ request }: IRequestItemProps) {
    const { localPeerId, status } = request;
    let statusText: string | undefined;

    if (status === "screen:send") {
        statusText = "اشتراک گذاری صفحه";
    } else if (status === "video:send") {
        statusText = "تماس تصویری";
    } else if (status === "audio:send") {
        statusText = "تماس صوتی";
    } else if (status === "game:send") {
        statusText = "بازی";
    }

    const answerRequestHandler = () => {
        if (peerConnectionSignal.value?.connectionState === "connected") {
            peerConnectionSignal.value.close();
        } else {
            hangup();
        }

        batch(() => {
            currentRequestSignal.value = request;
            remotePeerIdSignal.value = localPeerId;
            isRequestsDrawerOpenSignal.value = false;
        });
        const peerURL = buildURL({
            url: "/connect",
            query: {
                remotePeerId: request.localPeerId,
            },
        });
        routerSignal.value!.push(peerURL);
    };

    const rejectRequestHandler = () => {
        socketSignal.value?.emit("rejectToServer", { request });
        receivedRequestsSignal.value = receivedRequestsSignal.value.filter((item) => {
            return item.localPeerId !== request.localPeerId && item.status !== request.status;
        });
    };

    // checks if the request is from a friend or not if so we can show the name else we can show the peer id
    const displaySender = () => {
        const friend = friendsSignal.value.find((peer) => peer.localPeerId === localPeerId);
        return friend ? friend.name : localPeerId;
    };

    return (
        <div className={"flex flex-col justify-center items-center p-2 gap-5 border-b text-xs"}>
            <span className={"bg-primary text-primary-foreground px-3 py-1 rounded"}>{statusText}</span>
            <p className={"text-wrap text-center"}>{displaySender()}</p>
            <div className={"flex items-center justify-center gap-2"}>
                <Button variant={"outline"} size={"icon"} onClick={answerRequestHandler} aria-label={"پذیرش درخواست"}>
                    <Thumb className={"size-5"} />
                </Button>
                <Button variant={"outline"} size={"icon"} onClick={rejectRequestHandler} aria-label={"رد درخواست"}>
                    <Thumb className={"rotate-180 size-5"} />
                </Button>
            </div>
        </div>
    );
}

export default RequestItem;
