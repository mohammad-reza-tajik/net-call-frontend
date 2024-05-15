"use client"
import type {Request} from "@/types";
import {Button} from "@/components/ui/button";
import {useAppDispatch, useAppSelector} from "@/store";
import createAnswer from "@/utils/createAnswer";
import {Thumb} from "@/components/shared/Icons";

function RequestItem({request}: { request: Request }) {

    const {peerId, status} = request;
    const dispatch = useAppDispatch();
    const peer = useAppSelector(state => state.peer);
    let statusText: string | undefined;

    if (status === "screen:send") {
        statusText = "اشتراک گذاری صفحه"
    } else if (status === "video:send") {
        statusText = "تماس تصویری"
    } else if (status === "audio:send") {
        statusText = "تماس صوتی"
    }

    async function answerHandler(request: Request) {
        await createAnswer({request, peer, dispatch});
    }

    return (
        <div className={"flex flex-col justify-center items-center p-2 gap-5 border rounded text-xs"}>
            <span className={"bg-primary p-1 rounded"}>
                {statusText}
            </span>
            <p>
                {peerId}
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