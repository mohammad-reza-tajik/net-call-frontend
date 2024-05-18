import {Exchange, Phone} from "@/components/shared/Icons";
import {Peer} from "@/types";

interface Props{
    peer: Peer;
}

function AudioCall({peer}: Props) {

    return (
        <div className={"flex flex-1 justify-center items-center gap-5"}>
            <div className={"flex flex-col gap-5 justify-between items-center size-96 border rounded p-5"}>
                <p className={"bg-primary p-2 rounded"}>فرستنده</p>
                <Phone className={"size-20"}/>
                <p>
                    {peer.status === "audio:receive" ? peer.currentRequest?.peerId : peer.peerId}
                </p>
            </div>
            <Exchange className={"size-10 self-center"} />
            <div className={"flex flex-col gap-5 justify-between items-center size-96 border rounded p-5"}>
                <p className={"bg-primary p-2 rounded"}>گیرنده</p>
                <Phone className={"size-20"}/>
                <p>
                    {peer.status === "audio:receive" ? peer.peerId : peer.currentResponse?.peerId}
                </p>
            </div>
        </div>
    )
}

export default AudioCall;