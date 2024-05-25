import Features from "@/components/connectPage/Features";
import StreamControls from "@/components/connectPage/StreamControls";

function ActionBar() {


    return (
        <section className={"p-5 border-t"}>
            <Features />
            <StreamControls />
        </section>
    )
}

export default ActionBar;