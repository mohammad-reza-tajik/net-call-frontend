import PeerItem from "@/components/homePage/PeerItem";
import type {IConnectedPeer} from "@/types";

interface IPeerListProps {
    connectedPeers : IConnectedPeer[]
}

function PeerList({connectedPeers}: IPeerListProps) {

    return (
        <div className={"grid grid-cols-3 gap-4"}>
            {
                connectedPeers.length === 0 ? <p className={"text-center col-span-full p-5"}>هیچ دستگاه متصل دیگری موجود نیست</p> :
                    connectedPeers.map((connectedPeer) => {
                    return <PeerItem key={connectedPeer.localPeerId} connectedPeer={connectedPeer}/>
                })
            }
        </div>
    )
}

export default PeerList;