import {useSearchParams} from "next/navigation";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import { useSignalEffect } from "@preact/signals-react";
import { useEffect } from "react";

/**
 * RemotePeerIdUpdater is a component responsible for retrieving the remote peer ID
 * from the URL query parameters and updating the corresponding signal. It ensures
 * that the `remotePeerIdSignal` is set with the value from the query parameter
 * if it is not already set.
 *
 * ------------> the reason I put it in a separate component is because I don't want to wrap the ConnectScreen component in a suspense component
 */
function RemotePeerIdUpdater() {
    const searchParams = useSearchParams();

    const remotePeerIdQuery = searchParams.get("remotePeerId");

    useEffect(() => {
        if (!remotePeerIdSignal.value && remotePeerIdQuery) {
            remotePeerIdSignal.value = remotePeerIdQuery;
        }
    }, [remotePeerIdQuery]);

    useSignalEffect(() =>{
        if (!remotePeerIdSignal.value && remotePeerIdQuery) {
            remotePeerIdSignal.value = remotePeerIdQuery;
        }
    });

    return <></>;
}

export default RemotePeerIdUpdater;
