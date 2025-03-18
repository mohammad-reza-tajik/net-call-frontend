import {usePathname, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import statusSignal from "@/signals/peer/status";
import hangup from "@/core/hangup";

function HangupOnRouteChange() {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (statusSignal.value) {
           hangup(true);
        }
    }, [pathName, searchParams]);

    return <></>;
}

export default HangupOnRouteChange;