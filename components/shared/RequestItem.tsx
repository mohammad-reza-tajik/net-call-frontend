"use client"
import type {IRequest} from "@/types";
import {Button} from "@/components/ui/button";
import {Thumb} from "@/components/shared/Icons";
import {useRouter} from "next/navigation";
import formUrlQuery from "@/utils/formUrlQuery";
import currentRequestSignal from "@/signals/peer/currentRequest";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";

interface IRequestItemProps {
    request: IRequest
}

function RequestItem({request}: IRequestItemProps) {

    const {localPeerId, status} = request;
    let statusText: string | undefined;

    const router = useRouter();

    if (status === "screen:send") {
        statusText = "اشتراک گذاری صفحه"
    } else if (status === "video:send") {
        statusText = "تماس تصویری"
    } else if (status === "audio:send") {
        statusText = "تماس صوتی"
    }

    const answerRequestHandler = () => {
        currentRequestSignal.value = request;
        remotePeerIdSignal.value = localPeerId;
        const peerURL = formUrlQuery({
            params: {
                remotePeerId: request.localPeerId
            }
        });
        router.push(`/connect${peerURL}`);
    }

    const rejectRequestHandler = () => {
        receivedRequestsSignal.value = receivedRequestsSignal.value.filter((item) => {
            return item.localPeerId !== request.localPeerId && item.status !== request.status;
        })
    }

    return (
        <div className={"flex flex-col justify-center items-center p-2 gap-5 border rounded text-xs"}>
            <span className={"bg-primary p-1 rounded"}>
                {statusText}
            </span>
            <p>
                {localPeerId}
            </p>
            <div className={"flex items-center justify-center gap-2"}>
                <Button variant={"outline"} className={"gap-1"} onClick={answerRequestHandler}>
                    <Thumb className={" size-5"}/>
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