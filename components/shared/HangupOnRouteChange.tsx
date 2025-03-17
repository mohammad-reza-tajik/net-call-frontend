import {usePathname, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import socketSignal from "@/signals/socket";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import statusSignal from "@/signals/peer/status";
import hangup from "@/core/hangup";

function HangupOnRouteChange() {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (statusSignal.value) {
            socketSignal.value?.emit("hangupToServer", {localPeerId: localPeerIdSignal.value});
           hangup();
        }
    }, [pathName, searchParams]);

    return <></>;
}

export default HangupOnRouteChange;