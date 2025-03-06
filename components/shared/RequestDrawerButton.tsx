"use client";
import {Envelope} from "@/components/shared/Icons";
import {isRequestsDrawerOpenSignal} from "@/signals/drawer";
import ActionButton from "@/components/connectPage/ActionButton";
import cn from "@/lib/utils/cn";
import haveNewRequestSignal from "@/signals/haveNewRequest";
import {batch} from "@preact/signals-react";
import {useSignals} from "@preact/signals-react/runtime";

function RequestDrawerButton() {

    useSignals();

    const openDrawerHandler = () => {
        batch(() => {
            isRequestsDrawerOpenSignal.value = true;
            haveNewRequestSignal.value = false;
        });
    };

    return (
            <ActionButton className={cn({"animate-bounce": haveNewRequestSignal.value})}
                          icon={<Envelope className={"size-7"}/>}
                          tooltipContent={"درخواست های دریافت شده"}
                          handler={openDrawerHandler}
            />
    );
}

export default RequestDrawerButton;