"use client";
import {toast} from "react-hot-toast";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRef} from "react";
import {useSignals} from "@preact/signals-react/runtime";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import routerSignal from "@/signals/router";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import isValidUUID from "@/lib/utils/isValidUUID";
import buildURL from "@/lib/utils/buildURL";

function PeerForm() {

    useSignals();
    const remotePeerIdRef = useRef<HTMLInputElement>(null);

    const submitRemotePeerIdHandler = () => {
        if (!remotePeerIdRef.current?.value) {
            return;
        }

        if (!isValidUUID(remotePeerIdRef.current.value) || remotePeerIdRef.current.value === localPeerIdSignal.value) {
            toast.error("آیدی وارد شده صحیح نیست");
            return;
        }

        const peerURL = buildURL({
            query: {
                remotePeerId:remotePeerIdRef.current.value
            },
            url : "/connect"
        });

        remotePeerIdSignal.value = remotePeerIdRef.current.value;
        remotePeerIdRef.current.value = "";
        routerSignal.value!.push(peerURL);
    };

    return (
        <div className={"flex flex-col justify-center items-center py-5 md:py-10 gap-5 border rounded"}>
            <Input className={"w-3/4 md:w-80 p-7"} ref={remotePeerIdRef} placeholder={"آیدی دستگاه ..."}/>
            <Button onClick={submitRemotePeerIdHandler} size={"lg"} variant={"outline"}>
                    تایید
            </Button>
        </div>
    );
}

export default PeerForm;