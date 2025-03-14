import {usePathname, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {peerConnectionSignal} from "@/signals/peer/peerConnection";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import statusSignal from "@/signals/peer/status";

function HangupOnRouteChange() {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (statusSignal.value) {
            socketSignal.value?.emit("hangupToServer", {localPeerId: localPeerIdSignal.value});
            peerConnectionSignal.value?.close();
        }
    }, [pathName, searchParams]);

    return <></>;
}

export default HangupOnRouteChange;