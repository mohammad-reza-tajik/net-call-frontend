import {TooltipProvider} from "@/components/ui/tooltip";
import ShareScreen from "@/components/shared/ShareScreen";
import AudioCall from "@/components/shared/AudioCall";
import VideoCall from "@/components/shared/VideoCall";
import Chat from "@/components/shared/Chat";
import SendFile from "@/components/shared/SendFile";

function Toolbar() {


    return (
        <section className={"flex justify-center items-center p-5 border-t gap-5"}>
            <TooltipProvider>
               <ShareScreen />
                <AudioCall />
                <VideoCall />
                <Chat />
                <SendFile />
            </TooltipProvider>
        </section>
    )
}

export default Toolbar;