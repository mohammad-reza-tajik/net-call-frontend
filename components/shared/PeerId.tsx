"use client"

import {useAppSelector} from "@/store";
import {Button} from "@/components/ui/button";

function PeerId() {

    const peerId = useAppSelector(state => state.peer.peerId);

    return (
        <div className={"flex items-center justify-center gap-2 text-sm"}>

            آیدی شما :

            {
                peerId &&
                <Button variant={"outline"} onClick={() => navigator.clipboard.writeText(peerId)}>
                    {peerId}
                </Button>
            }
        </div>
    )
}

export default PeerId;