import {Monitor} from "@/components/shared/Icons";
import currentResponseSignal from "@/signals/currentResponse";

function ScreenSend() {

    return (
        <div className={"flex flex-1 justify-center items-center flex-col gap-7"}>
            <Monitor className={"size-28"}/>
            <div className={"text-lg text-center leading-loose"}>
                صفحه شما برای
                <p className={"border py-1 px-4 rounded bg-muted"}>
                {currentResponseSignal.value?.localPeerId}
                </p>
                به اشتراک گذاشته شده است
            </div>
        </div>
    )
}

export default ScreenSend;
