import {ArrowsLeftRight, Phone} from "@/components/shared/Icons";
import statusSignal from "@/signals/peer/status";
import currentResponseSignal from "@/signals/peer/currentResponse";
import localPeerId from "@/signals/peer/localPeerId";
import currentRequestSignal from "@/signals/peer/currentRequest";

function AudioCall() {

    return (
        <div className={"flex flex-col md:flex-row size-full justify-center items-center gap-2 md:gap-5"}>
            <div className={"flex flex-col gap-5 justify-between items-center size-52 lg:size-96 border rounded p-2 md:p-5 text-sm md:text-base"}>
                <p className={"bg-primary text-primary-foreground p-1 md:p-2 rounded text-sm md:text-base"}>فرستنده</p>
                <Phone className={"size-14 md:size-20"}/>
                <p className={"w-5/6 truncate [direction:ltr]"}>
                    {statusSignal.value === "audio:receive" ? currentRequestSignal.value?.localPeerId : localPeerId.value}
                </p>
            </div>
            <ArrowsLeftRight className={"size-10 self-center"} />
            <div className={"flex flex-col gap-5 justify-between items-center size-52 lg:size-96 border rounded p-2 md:p-5 text-sm md:text-base"}>
                <p className={"bg-primary text-primary-foreground p-1 md:p-2 rounded text-sm md:text-base"}>گیرنده</p>
                <Phone className={"size-14 md:size-20"}/>
                <p className={"w-5/6 truncate [direction:ltr]"}>
                    {statusSignal.value === "audio:receive" ? localPeerId.value : currentResponseSignal.value?.localPeerId}
                </p>
            </div>
        </div>
    )
}

export default AudioCall;