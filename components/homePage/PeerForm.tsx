"use client"
import {toast} from "react-hot-toast";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRef} from "react";
import formUrlQuery from "@/utils/formUrlQuery";
import {useSignals} from "@preact/signals-react/runtime";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import routerSignal from "@/signals/router";

function PeerForm() {

    useSignals();
    const remotePeerIdRef = useRef<HTMLInputElement>(null);

    function submitRemotePeerIdHandler() {
        if (!remotePeerIdRef.current?.value) {
            return
        }

        if (remotePeerIdRef.current.value.length < 36) {
            return toast.error("آیدی وارد شده صحیح نیست");
        }

        const peerURL = formUrlQuery({
            params: {
                remotePeerId:remotePeerIdRef.current.value
            }
        });

        remotePeerIdSignal.value = remotePeerIdRef.current.value;
        remotePeerIdRef.current.value = "";
        routerSignal.value!.push(`/connect${peerURL}`);
    }

    return (
        <div className={"flex flex-col justify-center items-center py-5 md:py-10 gap-5 border rounded"}>
            <Input className={"w-3/4 md:w-80 p-7"} ref={remotePeerIdRef} placeholder={"آیدی دستگاه ..."}/>
            <Button onClick={submitRemotePeerIdHandler} size={"lg"}>
                    تایید
            </Button>
        </div>
    )
}

export default PeerForm;