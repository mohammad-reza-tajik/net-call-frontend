"use client"

import { useAppSelector} from "@/store";
import { Create, Devices} from "@/components/shared/Icons";
import PeerList from "@/components/homePage/PeerList";
import SectionHeading from "@/components/shared/SectionHeading";
import PeerForm from "@/components/homePage/PeerForm";

function StartScreen() {

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