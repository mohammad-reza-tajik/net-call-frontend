"use client"
import useInitialize from "@/hooks/useInitialize";

function Initialize({children}: {children: React.ReactNode}) {

    useInitialize();

    return (
        <>
            {children}
        </>
    )
}

export default Initialize;