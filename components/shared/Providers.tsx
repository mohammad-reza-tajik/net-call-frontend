"use client"
import {ToastContainer} from "react-toastify";
import {Button} from "@/components/ui/button";
import {Check, Close, Info, Warning} from "@/components/shared/Icons";

function Providers({children}: { children: React.ReactNode }) {

    return (
        <>
            <ToastContainer
                position={"bottom-left"}
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                icon={({type}) => {
                    if (type === "info"){
                        return <Info />
                    } else if (type === "success") {
                        return <Check />
                    } else if (type === "error"){
                        return <Warning className={"fill-destructive"} />
                    }
                    return false
                }}
                closeOnClick={false}
                rtl
                pauseOnFocusLoss
                toastClassName={"flex items-center bg-background text-foreground border font-dana-medium"}
                closeButton={({closeToast}) => (
                    <Button size={"icon"} variant={"ghost"} onClick={closeToast}>
                        <Close className={"size-5"}/>
                    </Button>
                )}
            />
            {children}
        </>
    )
}

export default Providers;