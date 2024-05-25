import {peerActions, useAppDispatch} from "@/store";
import {validate} from "uuid";
import {toast} from "react-toastify";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRef} from "react";
import {useRouter} from "next/navigation";
import formUrlQuery from "@/utils/formUrlQuery";

function PeerForm() {

    const remotePeerIdRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();

    function submitRemotePeerIdHandler() {
        if (!remotePeerIdRef.current?.value) {
            return
        }

        if (!validate(remotePeerIdRef.current.value)) {
            return toast.error("آیدی وارد شده صحیح نیست");
        }

        const peerURL = formUrlQuery({
            params: {
                peerId:remotePeerIdRef.current.value
            }
        });

        dispatch(peerActions.setRemotePeerId(remotePeerIdRef.current.value));
        dispatch(peerActions.setConnectionMode("pair"));
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