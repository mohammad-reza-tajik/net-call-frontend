import {usePathname, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import hangup from "@/core/hangup";

function HangupOnRouteChange() {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (peerConnectionSignal.value?.connectionState === "connected" || peerConnectionSignal.value?.connectionState === "connecting") {
            socketSignal.value?.emit("hangupToServer", {localPeerId: localPeerIdSignal.value});
            hangup();
        }
    }, [pathName, searchParams]);

    return <></>
}

export default HangupOnRouteChange;