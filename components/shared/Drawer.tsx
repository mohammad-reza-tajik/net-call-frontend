"use client"
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";
import {useSignals} from "@preact/signals-react/runtime";
import {Signal} from "@preact/signals-react";

function Drawer({children , openSignal}: {children: React.ReactNode , openSignal : Signal<boolean>}) {

    useSignals();

    const closeDrawerHandler = ()=>{
        openSignal.value = false
    }

    return (
        <>
            {openSignal.value && (
                <div className={"fixed inset-0 bg-foreground opacity-50 z-50"} onClick={closeDrawerHandler}/>
            )}
            <div
                className={cn("fixed top-0 left-0 h-full w-3/4 sm:w-1/4 flex flex-col gap-2 p-5 bg-background z-50 transition-transform ease-in-out duration-300", {"-translate-x-full": !openSignal.value})}>
                <Button size={"icon"} variant={"outline"} onClick={closeDrawerHandler} aria-label={"بستن منو"}>
                    <Close/>
                </Button>
                {children}
            </div>
        </>
    )
}

export default Drawer;
