"use client"

import PeerItem from "@/components/homePage/PeerItem";
import {ConnectedPeer} from "@/types";
import localPeerIdSignal from "@/signals/peer/localPeerId";

function PeerList({connectedPeers}: {connectedPeers : ConnectedPeer[]}) {

    return (

        <div className={"grid grid-cols-3 gap-4"}>
            {
                connectedPeers.length !== 0 && connectedPeers.map((connectedPeer) => {
                    if (connectedPeer.localPeerId === localPeerIdSignal.value ) return;
                    return <PeerItem key={connectedPeer.localPeerId} connectedPeer={connectedPeer}/>
                })
            }
        </div>
    )
}

export default PeerList;