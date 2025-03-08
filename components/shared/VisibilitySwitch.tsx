"use client";
import {Switch} from "@/components/ui/switch";
import visibilitySignal from "@/signals/peer/visibility";
import {useSignals} from "@preact/signals-react/runtime";
import socketSignal from "@/signals/socket";
import statusSignal from "@/signals/peer/status";

function VisibilitySwitch() {

    useSignals();

    const changeVisibilityHandler = () => {
        visibilitySignal.value = visibilitySignal.value === "visible" ? "hidden" : "visible";
        localStorage.setItem("visibility", visibilitySignal.value);
        if (socketSignal.value) {
            socketSignal.value.disconnect();
            socketSignal.value = undefined;
        }
    };

    // we should be able to change visibility only when we are not in any specific status
    if (statusSignal.value) return;

    return (
        <>
            <label className={"text-xs"} htmlFor={"visibility"}>
                خصوصی
            </label>
            <Switch id={"visibility"} onCheckedChange={changeVisibilityHandler} checked={visibilitySignal.value === "hidden"} className={"[direction:ltr]"} />
        </>
    );
}

export default VisibilitySwitch;