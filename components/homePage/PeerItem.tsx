"use client"
import type {IConnectedPeer} from "@/types";
import {Mobile, Monitor} from "@/components/shared/Icons";
import formUrlQuery from "@/utils/formUrlQuery";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import routerSignal from "@/signals/router";

interface IPeerItemProps {
    connectedPeer: IConnectedPeer
}

function PeerItem({connectedPeer: {localPeerId, deviceType}}: IPeerItemProps) {

    const peerURL = formUrlQuery({
        params: {
            remotePeerId : localPeerId
        }
    });

    const peerClickHandler = () => {
        remotePeerIdSignal.value = localPeerId;
        routerSignal.value!.push(`/connect${peerURL}`);
    }

    return (
        <button
              className={"flex flex-col gap-2 md:gap-5 p-3 md:p-5 items-center border rounded relative hover:bg-gray-100/10 "} onClick={peerClickHandler}>
            {
                deviceType === "desktop" ? <Monitor className={"size-10 md:size-28"}/> : <Mobile className={"size-10 md:size-28"}/>
            }
            <span className={"absolute right-2 top-2 bg-green-400 size-2 md:size-3 rounded-full animate-pulse"}/>
            <p className={"text-xs md:text-sm truncate w-5/6"}>{localPeerId}</p>
        </button>
    )
}

export default PeerItem;