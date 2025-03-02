"use client"
import type {IRequest} from "@/types";
import {Button} from "@/components/ui/button";
import {Thumb} from "@/components/shared/Icons";
import buildURL from "@/lib/utils/buildURL";
import currentRequestSignal from "@/signals/peer/currentRequest";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import routerSignal from "@/signals/router";
import socketSignal from "@/signals/socket";
import hangup from "@/core/hangup";
import {batch} from "@preact/signals-react";
import {isRequestsDrawerOpenSignal} from "@/signals/drawer";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";

interface IRequestItemProps {
    request: IRequest
}

function RequestItem({request}: IRequestItemProps) {

    const {localPeerId, status} = request;
    let statusText: string | undefined;

    if (status === "screen:send") {
        statusText = "اشتراک گذاری صفحه"
    } else if (status === "video:send") {
        statusText = "تماس تصویری"
    } else if (status === "audio:send") {
        statusText = "تماس صوتی"
    } else if (status === "game:send"){
        statusText = "بازی"
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
            url : "/connect",
            query: {
                remotePeerId: request.localPeerId
            }
        });
        routerSignal.value!.push(peerURL);
    }

    const rejectRequestHandler = () => {
        socketSignal.value?.emit("rejectToServer", {request});
        receivedRequestsSignal.value = receivedRequestsSignal.value.filter((item) => {
            return item.localPeerId !== request.localPeerId && item.status !== request.status;
        })
    }

    return (
        <div className={"flex flex-col justify-center items-center p-2 gap-5 border-b text-xs"}>
            <span className={"bg-primary text-primary-foreground p-1 rounded"}>
                {statusText}
            </span>
            <p className={"[direction:ltr] text-wrap text-center"}>
                {localPeerId}
            </p>
            <div className={"flex items-center justify-center gap-2"}>
                <Button variant={"outline"} className={"gap-1"} onClick={answerRequestHandler}>
                    <Thumb className={"size-5"}/>
                    پذیرفتن
                </Button>
                <Button variant={"outline"} className={"gap-1"} onClick={rejectRequestHandler}>
                    <Thumb className={"rotate-180 size-5"}/>
                    رد کردن
                </Button>
            </div>
        </div>
    )
}

export default RequestItem;