import {Phone, Monitor, Camera, GameController} from "@/components/shared/Icons";
import shareScreen from "@/core/shareScreen";
import videoCall from "@/core/videoCall";
import audioCall from "@/core/audioCall";
import inviteToGame from "@/core/inviteToGame";

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

    {
        icon: <GameController className={"size-7"}/>,
        tooltipContent: "بازی",
        handler: () => inviteToGame()
    }
    ];


export default features;