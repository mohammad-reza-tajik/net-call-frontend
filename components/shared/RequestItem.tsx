"use client"
import type {Request , Status} from "@/types";
import {Button} from "@/components/ui/button";
import {peerActions, useAppDispatch, useAppSelector} from "@/store";
import createAnswer from "@/utils/createAnswer";

function RequestItem({request}: { request: Request }) {

    const {peerId, status} = request;
    const dispatch = useAppDispatch();
    const peer = useAppSelector(state => state.peer);
    let statusText : string | undefined;

    if (status === "screen:send")  {
        statusText = "اشتراک گذاری صفحه"
    } else if (status === "video:send")  {
        statusText = "تماس تصویری"
    } else if (status === "audio:send")  {
        statusText = "تماس صوتی"
    }

    async function answerHandler(request: Request) {
        const answerStatus = request.status.split(":").at(0)!.concat(":receive") as Status;
        dispatch(peerActions.setStatus(answerStatus));
        await createAnswer({dispatch, peer, request});
        dispatch(peerActions.removeRequest(request));
    }

    return (
        <div className={"flex flex-col justify-center items-center p-2 gap-5 border rounded"}>
            <span className={"bg-primary p-1 rounded text-xs"}>
                {statusText}
            </span>
            <p className={"text-sm"}>
                {peerId}
            </p>
            <Button variant={"secondary"} className={"self-stretch"} onClick={() => answerHandler(request)}>
                پذیرفتن
            </Button>
        </div>
    )
}

export default RequestItem;