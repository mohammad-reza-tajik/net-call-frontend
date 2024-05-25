"use client"
import {ConnectedPeer} from "@/types";
import {Mobile, Monitor} from "@/components/shared/Icons";
import formUrlQuery from "@/utils/formUrlQuery";
import {useRouter} from "next/navigation";
import {peerActions, useAppDispatch} from "@/store";

function PeerItem({connectedPeer: {peerId, deviceType}}: { connectedPeer: ConnectedPeer }) {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const peerURL = formUrlQuery({
        params: {
            peerId
        }
    });

    const peerClickHandler = () => {
        dispatch(peerActions.setRemotePeerId(peerId));
        router.push(`/connect${peerURL}`);
    }

    return (
        <button
              className={"flex flex-col gap-5 p-5 items-center border rounded relative hover:bg-gray-100/10"} onClick={peerClickHandler}>
            {
                deviceType === "desktop" ? <Monitor className={"size-28"}/> : <Mobile className={"size-28"}/>
            }
            <span className={"absolute right-2 top-2 bg-green-400 size-3 rounded-full animate-pulse"}/>
            <p>{peerId}</p>
        </button>
    )
}

export default PeerItem;