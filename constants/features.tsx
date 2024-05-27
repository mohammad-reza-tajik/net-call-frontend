import {File, Chat, Phone, Monitor, Camera} from "@/components/shared/Icons";
import shareScreen from "@/utils/shareScreen";
import videoCall from "@/utils/videoCall";
import audioCall from "@/utils/audioCall";

function features() {
    return [
        {
            icon: <Monitor className={"size-7"}/>,
            tooltipContent: "به اشتراک گذاری صفحه",
            handler: () => shareScreen()
        },
        {
            icon: <Camera className={"size-7"}/>,
            tooltipContent: "تماس تصویری",
            handler: () => videoCall()
        },
        {
            icon: <Phone className={"size-7"}/>,
            tooltipContent: "تماس صوتی",
            handler: () => audioCall()
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