"use client"
import {Provider} from "react-redux";
import {ToastContainer} from "react-toastify";
import {store} from "@/store";
import {Button} from "@/components/ui/button";
import {Close} from "@/components/shared/Icons";


function Providers({children}: { children: React.ReactNode }) {

    return (
        <Provider store={store}>
            <ToastContainer
                position={"bottom-left"}
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl
                pauseOnFocusLoss
                toastClassName={"flex items-center bg-background text-foreground border font-dana-medium"}
                closeButton={({closeToast}) => (
                    <Button size={"icon"} variant={"ghost"} onClick={closeToast}>
                        <Close className={"size-5"}/>
                    </Button>
                )
                }
            />
            {children}
        </Provider>
    )
}

export default Providers;