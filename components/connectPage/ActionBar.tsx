import Features from "@/components/connectPage/Features";
import StreamControls from "@/components/connectPage/StreamControls";

function ActionBar() {


    return (
        <section className={"p-3 md:p-5 border-t w-full"}>
            <Features />
            <StreamControls />
        </section>
    )
}

export default ActionBar;