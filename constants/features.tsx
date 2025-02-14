import {Camera, GameController, Monitor, Phone} from "@/components/shared/Icons";
import shareScreen from "@/core/shareScreen";
import videoCall from "@/core/videoCall";
import audioCall from "@/core/audioCall";
import inviteToGame from "@/core/inviteToGame";

const features = [
    {
        name : "screen-share",
        icon: <Monitor className={"size-7"}/>,
        tooltipContent: "به اشتراک گذاری صفحه",
        handler: () => shareScreen()
    },
    {
        name : "video-call",
        icon: <Camera className={"size-7"}/>,
        tooltipContent: "تماس تصویری",
        handler: () => videoCall()
    },
    {
        name : "audio-call",
        icon: <Phone className={"size-7"}/>,
        tooltipContent: "تماس صوتی",
        handler: () => audioCall()
    },

    {
        name : "game",
        icon: <GameController className={"size-7"}/>,
        tooltipContent: "بازی",
        handler: () => inviteToGame()
    }
];


export default features;