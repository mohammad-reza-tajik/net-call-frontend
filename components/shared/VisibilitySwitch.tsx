"use client";
import { Switch } from "@/components/ui/switch";
import visibilitySignal from "@/signals/peer/visibility";
import { useSignals } from "@preact/signals-react/runtime";
import socketSignal from "@/signals/socket";
import statusSignal from "@/signals/peer/status";
import { Skeleton } from "@/components/ui/skeleton";
import isLoadedSignal from "@/signals/isLoaded";

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
            {isLoadedSignal.value ? (
                <>
                    <label className={"text-xs"} htmlFor={"visibility"}>
                        خصوصی
                    </label>
                    <Switch
                        id={"visibility"}
                        onCheckedChange={changeVisibilityHandler}
                        checked={visibilitySignal.value === "hidden"}
                        className={"[direction:ltr]"}
                    />
                </>
            ) : (
                <Skeleton className={"w-20 h-8"} />
            )}
        </>
    );
}

export default VisibilitySwitch;
