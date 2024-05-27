"use client"
import {validate} from "uuid";
import {toast} from "react-toastify";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRef} from "react";
import {useRouter} from "next/navigation";
import formUrlQuery from "@/utils/formUrlQuery";
import {useSignals} from "@preact/signals-react/runtime";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";

function PeerForm() {

    useSignals();
    const remotePeerIdRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    function submitRemotePeerIdHandler() {
        if (!remotePeerIdRef.current?.value) {
            return
        }

        if (!validate(remotePeerIdRef.current.value)) {
            return toast.error("آیدی وارد شده صحیح نیست");
        }

        const peerURL = formUrlQuery({
            params: {
                remotePeerId:remotePeerIdRef.current.value
            }
        });

        remotePeerIdSignal.value = remotePeerIdRef.current.value;
        remotePeerIdRef.current.value = "";
        router.push(`/connect${peerURL}`);
    }

    return (
        <div className={"flex flex-col justify-center items-center py-10 gap-5 border rounded"}>
            <Input className={"w-80 p-7"} ref={remotePeerIdRef} placeholder={"آیدی دستگاه ..."}/>
            <Button className={"gap-1"} onClick={submitRemotePeerIdHandler} size={"lg"}>
                    تایید
            </Button>
        </div>
    )
}

export default PeerForm;