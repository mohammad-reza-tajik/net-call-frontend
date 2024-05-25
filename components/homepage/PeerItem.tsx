import {ConnectedPeer} from "@/types";
import {Mobile, Monitor} from "@/components/shared/Icons";
import Link from "next/link";
import formUrlQuery from "@/utils/formUrlQuery";

function PeerItem({connectedPeer: {peerId, deviceType}}: { connectedPeer: ConnectedPeer }) {

    const peerURL = formUrlQuery({
        params: {
            peerId
        }
    });

    return (
        <Link href={`/connect${peerURL}`}
              className={"flex flex-col gap-5 p-5 items-center justify-center border rounded relative hover:bg-gray-100/10 cursor-pointer"}>
            {
                deviceType === "desktop" ? <Monitor className={"size-28"}/> : <Mobile className={"size-28"}/>
            }
            <span className={"absolute right-2 top-2 bg-green-400 size-3 rounded-full animate-pulse"}/>
            <p>{peerId}</p>
        </Link>
    )
}

export default PeerItem;