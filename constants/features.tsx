import {Attach, Chat, Phone, Screen, Video} from "@/components/shared/Icons";
import {Peer} from "@/types";
import {shareScreen} from "@/utils/shareScreen";
import videoCall from "@/utils/videoCall";
import audioCall from "@/utils/audioCall";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";

function features({dispatch, peer}: { dispatch: ThunkDispatch, peer: Peer }) {
    return [
        {
            icon: <Screen className={"size-9"}/>,
            tooltipContent: "به اشتراک گذاری صفحه",
            handler: () => shareScreen({dispatch, peer})
        },
        {
            icon: <Video className={"size-9"}/>,
            tooltipContent: "تماس تصویری",
            handler: () => videoCall({dispatch, peer})
        },
        {
            icon: <Phone className={"size-9"}/>,
            tooltipContent: "تماس صوتی",
            handler: () => audioCall({dispatch, peer})
        },
        {
            icon: <Attach className={"size-9"}/>,
            tooltipContent: "ارسال فایل",
            handler: () => console.log("send file")
        },
        {
            icon: <Chat className={"size-9"}/>,
            tooltipContent: "گفتگو",
            handler: () => console.log("send message")
        }
    ]
}


export default features;