import {Pencil, Devices} from "@/components/shared/Icons";
import PeerList from "@/components/homePage/PeerList";
import PeerForm from "@/components/homePage/PeerForm";
import {Suspense} from "react";

function StartScreen() {

    return (
        <section className={"flex flex-col gap-5 flex-1 px-2"}>
            <h2 className={"flex items-center gap-3 py-1 md:py-3 text-sm md:text-lg"}>
                <Devices className={"size-5 md:size-7"}/>
                دستگاه های متصل
            </h2>
            <Suspense>
                <PeerList/>
            </Suspense>
            <h2 className={"flex items-center gap-3 py-1 md:py-3 text-sm md:text-lg"}>
                <Pencil className={"size-5 md:size-7"}/>
                وارد کردن آیدی دستگاه مقابل
            </h2>
            <PeerForm/>
        </section>
    )
}

export default StartScreen;