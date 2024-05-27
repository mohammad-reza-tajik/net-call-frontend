import {Exchange, Phone} from "@/components/shared/Icons";
import statusSignal from "@/signals/peer/status";
import currentResponseSignal from "@/signals/peer/currentResponse";
import localPeerId from "@/signals/peer/localPeerId";
import currentRequestSignal from "@/signals/peer/currentRequest";

function AudioCall() {

    return (
        <div className={"flex flex-1 justify-center items-center gap-5"}>
            <div className={"flex flex-col gap-5 justify-between items-center size-96 border rounded p-5"}>
                <p className={"bg-primary p-2 rounded"}>فرستنده</p>
                <Phone className={"size-20"}/>
                <p>
                    {statusSignal.value === "audio:receive" ? currentRequestSignal.value?.localPeerId : localPeerId.value}
                </p>
            </div>
            <Exchange className={"size-10 self-center"} />
            <div className={"flex flex-col gap-5 justify-between items-center size-96 border rounded p-5"}>
                <p className={"bg-primary p-2 rounded"}>گیرنده</p>
                <Phone className={"size-20"}/>
                <p>
                    {statusSignal.value === "audio:receive" ? localPeerId.value : currentResponseSignal.value?.localPeerId}
                </p>
            </div>
        </div>
    )
}

export default AudioCall;