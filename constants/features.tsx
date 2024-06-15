import {Phone, Monitor, Camera} from "@/components/shared/Icons";
import shareScreen from "@/utils/shareScreen";
import videoCall from "@/utils/videoCall";
import audioCall from "@/utils/audioCall";

const features = [
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
    ];


export default features;