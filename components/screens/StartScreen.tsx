"use client"
import { Create, Devices} from "@/components/shared/Icons";
import PeerList from "@/components/homePage/PeerList";
import SectionHeading from "@/components/shared/SectionHeading";
import PeerForm from "@/components/homePage/PeerForm";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import {useSignals} from "@preact/signals-react/runtime";

function StartScreen() {

    useSignals();

    return (
        <div className={"flex flex-col gap-5 flex-1"}>
            <SectionHeading>
                <Devices/>
                دستگاه های متصل
            </SectionHeading>
            <PeerList connectedPeers={connectedPeersSignal.value} />
            <SectionHeading>
                <Create/>
                وارد کردن آیدی دستگاه مقابل
            </SectionHeading>
            <PeerForm />
        </div>
    )
}

export default StartScreen;