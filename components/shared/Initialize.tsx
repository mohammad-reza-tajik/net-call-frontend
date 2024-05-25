"use client"
import useInitialize from "@/hooks/useInitialize";
import useSocket from "@/hooks/useSocket";

function Initialize({children}: {children: React.ReactNode}) {

    useInitialize();
    useSocket();

    return (
        <>
            {children}
        </>
    )
}

export default Initialize;