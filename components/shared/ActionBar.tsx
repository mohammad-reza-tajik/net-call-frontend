import Features from "@/components/shared/Features";
import StreamControls from "@/components/shared/StreamControls";

function ActionBar() {


    return (
        <section className={"p-5 border-t"}>
            <Features />
            <StreamControls />
        </section>
    )
}

export default ActionBar;