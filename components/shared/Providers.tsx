"use client"
import {Button} from "@/components/ui/button";
import {CheckCircle, Close, Info, Warning} from "@/components/shared/Icons";
import {Toaster, ToastBar, toast} from "react-hot-toast";

function Providers({children}: { children: React.ReactNode }) {

    return (
        <>
            <Toaster toastOptions={{
                duration: 5000,
                position: "bottom-right",
                icon: <Info className={"size-5"}/>,
                success: {icon: <CheckCircle className={"size-5"}/>},
                error: {icon: <Warning className={"size-5 fill-destructive"}/>}
            }}>
                {(t) => (
                    <ToastBar toast={t} style={{
                        backgroundColor: "hsl(var(--background))",
                        color: "hsl(var(--foreground))",
                        fill: "hsl(var(--foreground))",
                        border: "1px solid hsl(var(--border))",
                    }}>
                        {({icon, message}) => (
                            <div className={"min-w-56 flex items-center justify-between text-xs md:text-sm p-1"}>
                                <div className={"flex items-center gap-1"}>
                                    {icon}
                                    {message}
                                </div>
                                {t.type !== "loading" && (
                                    <Button size={"icon"} className={"size-7"} onClick={() => toast.dismiss(t.id)}>
                                        <Close className={"size-5"}/>
                                    </Button>
                                )}
                            </div>
                        )}
                    </ToastBar>
                )}
            </Toaster>
            {children}
        </>
    )
}

export default Providers;