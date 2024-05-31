import ConnectScreen from "@/components/screens/ConnectScreen";
import {Suspense} from "react";

function ConnectPage() {

    return (
        <main className={"flex flex-1 flex-col py-5"}>
            <Suspense>
                <ConnectScreen/>
            </Suspense>
        </main>
    )
}

export default ConnectPage;