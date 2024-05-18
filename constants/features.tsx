import {File, Chat, Phone, Monitor, Camera} from "@/components/shared/Icons";
import {Peer} from "@/types";
import {shareScreen} from "@/utils/shareScreen";
import videoCall from "@/utils/videoCall";
import audioCall from "@/utils/audioCall";
// @ts-ignore
import {ThunkDispatch} from "redux-thunk";

function features({dispatch, peer}: { dispatch: ThunkDispatch, peer: Peer }) {
    return [
        {
            icon: <Monitor className={"size-7"}/>,
            tooltipContent: "به اشتراک گذاری صفحه",
            handler: () => shareScreen({dispatch, peer})
        },
        {
            icon: <Camera className={"size-7"}/>,
            tooltipContent: "تماس تصویری",
            handler: () => videoCall({dispatch, peer})
        },
        {
            icon: <Phone className={"size-7"}/>,
            tooltipContent: "تماس صوتی",
            handler: () => audioCall({dispatch, peer})
        },
        {
            icon: <Chat className={"size-7"}/>,
            tooltipContent: "گفتگو",
            handler: () => console.log("send message")
        },
        {
            icon: <File className={"size-7"}/>,
            tooltipContent: "ارسال فایل",
            handler: () => console.log("send file")
        },
    ]
}


export default features;