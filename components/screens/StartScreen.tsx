"use client"
import { Pencil, Devices} from "@/components/shared/Icons";
import PeerList from "@/components/homePage/PeerList";
import PeerForm from "@/components/homePage/PeerForm";
import connectedPeersSignal from "@/signals/peer/connectedPeers";
import {useSignals} from "@preact/signals-react/runtime";

function StartScreen() {

    useSignals();

    return (
        <div className={"flex flex-col gap-5 flex-1 px-2"}>
            <h2 className={"flex items-center gap-3 py-1 md:py-3 text-sm md:text-lg"}>
                <Devices className={"size-5 md:size-7"}/>
                دستگاه های متصل
            </h2>
            <PeerList connectedPeers={connectedPeersSignal.value}/>
            <h2 className={"flex items-center gap-3 py-1 md:py-3 text-sm md:text-lg"}>
                <Pencil className={"size-5 md:size-7"}/>
                وارد کردن آیدی دستگاه مقابل
            </h2>
            <PeerForm />
        </div>
    )
}

export default StartScreen;