import PeerItem from "@/components/homePage/PeerItem";
import {ConnectedPeer} from "@/types";
import {useAppSelector} from "@/store";

function PeerList({connectedPeers}: {connectedPeers : ConnectedPeer[]}) {

    const localPeerId = useAppSelector((state) => state.peer.localPeerId);

    return (

        <div className={"grid grid-cols-3 gap-4"}>
            {
                connectedPeers.length !== 0 && connectedPeers.map((connectedPeer) => {
                    if (connectedPeer.localPeerId === localPeerId ) return;
                    return <PeerItem key={connectedPeer.localPeerId} connectedPeer={connectedPeer}/>
                })
            }
        </div>
    )
}

export default PeerList;