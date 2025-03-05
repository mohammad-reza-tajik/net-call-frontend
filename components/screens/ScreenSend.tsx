import {Monitor} from "@/components/shared/Icons";
import currentResponseSignal from "@/signals/peer/currentResponse";

function ScreenSend() {

    return (
        <div className={"flex justify-center items-center flex-col size-full gap-4 md:gap-7"}>
            <Monitor className={"size-20 md:size-28"}/>
            <div className={"text-sm md:text-lg text-center leading-loose"}>
                صفحه شما برای
                <p className={"border py-1 px-4 rounded bg-muted"}>
                {currentResponseSignal.value?.localPeerId}
                </p>
                به اشتراک گذاشته شده است
            </div>
        </div>
    );
}

export default ScreenSend;
