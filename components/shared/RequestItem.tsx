"use client"
import type {Request} from "@/types";
import {Button} from "@/components/ui/button";
import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import createAnswer from "@/utils/createAnswer";
import {Thumb} from "@/components/shared/Icons";
import {useRouter} from "next/navigation";
import formUrlQuery from "@/utils/formUrlQuery";

function RequestItem({request}: { request: Request }) {

    const {localPeerId, status} = request;
    const dispatch = useAppDispatch();
    const peer = useAppSelector(state => state.peer);
    let statusText: string | undefined;

    const router = useRouter();

    if (status === "screen:send") {
        statusText = "اشتراک گذاری صفحه"
    } else if (status === "video:send") {
        statusText = "تماس تصویری"
    } else if (status === "audio:send") {
        statusText = "تماس صوتی"
    }

    async function answerHandler(request: Request) {
        dispatch(peerActions.setCurrentRequest(request));
        dispatch(peerActions.setRemotePeerId(localPeerId));
        const peerURL = formUrlQuery({
            params: {
                RemotePeerId : request.localPeerId
            }
        });
        await createAnswer({request, peer, dispatch});
        router.push(`/connect${peerURL}`);
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

            <Button variant={"outline"} className={"gap-1"} onClick={() => answerHandler(request)}>
                <Thumb className={" size-5"} />
                پذیرفتن
            </Button>
            <Button variant={"outline"} className={"gap-1"} onClick={() => console.log("rejected")}>
                <Thumb className={"rotate-180 size-5"} />
                رد کردن
            </Button>
            </div>
        </div>
    )
}

export default RequestItem;