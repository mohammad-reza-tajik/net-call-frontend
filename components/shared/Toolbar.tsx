import {TooltipProvider} from "@/components/ui/tooltip";
import ShareScreen from "@/components/shared/ShareScreen";
import AudioCall from "@/components/shared/AudioCall";
import VideoCall from "@/components/shared/VideoCall";

function Toolbar() {

    return (
        <section className={"flex justify-center items-center p-5 fixed bottom-0 right-0 w-screen border-t gap-5"}>
            <TooltipProvider>
               <ShareScreen />
                <AudioCall />
                <VideoCall />
            </TooltipProvider>
        </section>
    )
}

export default Toolbar;