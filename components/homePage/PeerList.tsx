import PeerItem from "@/components/homePage/PeerItem";
import type {IConnectedPeer} from "@/types";

interface IPeerListProps {
    connectedPeers : IConnectedPeer[]
}

function PeerList({connectedPeers}: IPeerListProps) {

    return (
        <div className={"grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 overflow-y-auto max-h-56 md:max-h-80"}>
            {
                connectedPeers.length === 0 ? <p className={"text-center col-span-full p-5 text-xs md:text-sm"}>هیچ دستگاه متصل دیگری موجود نیست</p> :
                    connectedPeers.map((connectedPeer) => {
                    return <PeerItem key={connectedPeer.localPeerId} connectedPeer={connectedPeer}/>
                })
            }
        </div>
    )
}

export default PeerList;