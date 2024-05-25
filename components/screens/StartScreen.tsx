"use client"

import { useAppSelector} from "@/store";
import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";
import { Create, Devices} from "@/components/shared/Icons";
import PeerList from "@/components/homepage/PeerList";
import SectionHeading from "@/components/shared/SectionHeading";
import PeerForm from "@/components/homepage/PeerForm";

function StartScreen() {

    useInitialize();
    useSocket();
    const connectedPeers = useAppSelector(state => state.peer.connectedPeers);

    return (
        <div className={"flex flex-col gap-5 flex-1"}>
            <SectionHeading>
                <Devices/>
                دستگاه های متصل
            </SectionHeading>
            <PeerList connectedPeers={connectedPeers} />
            <SectionHeading>
                <Create/>
                وارد کردن آیدی دستگاه مقابل
            </SectionHeading>
            <PeerForm />
        </div>
    )
}

export default StartScreen;