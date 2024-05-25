import PeerItem from "@/components/homepage/PeerItem";
import {ConnectedPeer} from "@/types";

function PeerList({connectedPeers}: {connectedPeers : ConnectedPeer[]}) {

    return (

        <div className={"grid grid-cols-3 gap-4"}>
            {
                connectedPeers.length !== 0 && connectedPeers.map((peer) => {
                    return <PeerItem key={peer.peerId} connectedPeer={peer}/>
                })
            }
        </div>
    )
}

export default PeerList;