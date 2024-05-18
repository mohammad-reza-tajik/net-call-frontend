import {Monitor} from "@/components/shared/Icons";
import {Peer} from "@/types";



interface Props{
    peer: Peer;
}

function ScreenSend({peer}: Props) {

    return (
        <div className={"flex flex-1 justify-center items-center flex-col gap-7"}>
            <Monitor className={"size-28"}/>
            <p className={"text-xl text-center leading-loose"}>
                صفحه شما برای
                <p className={"border py-2 px-6 rounded bg-muted"}>
                {peer.currentResponse?.peerId}
                </p>
                به اشتراک گذاشته شده است
            </p>

        </div>

    )
}

export default ScreenSend;
