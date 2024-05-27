"use client"
import {ConnectedPeer} from "@/types";
import {Mobile, Monitor} from "@/components/shared/Icons";
import formUrlQuery from "@/utils/formUrlQuery";
import {useRouter} from "next/navigation";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";

function PeerItem({connectedPeer: {localPeerId, deviceType}}: { connectedPeer: ConnectedPeer }) {

    const router = useRouter();

    const peerURL = formUrlQuery({
        params: {
            remotePeerId : localPeerId
        }
    });

    const peerClickHandler = () => {
        remotePeerIdSignal.value = localPeerId;
        router.push(`/connect${peerURL}`);
    }

    return (
        <button
              className={"flex flex-col gap-5 p-5 items-center border rounded relative hover:bg-gray-100/10"} onClick={peerClickHandler}>
            {
                deviceType === "desktop" ? <Monitor className={"size-28"}/> : <Mobile className={"size-28"}/>
            }
            <span className={"absolute right-2 top-2 bg-green-400 size-3 rounded-full animate-pulse"}/>
            <p>{localPeerId}</p>
        </button>
    )
}

export default PeerItem;