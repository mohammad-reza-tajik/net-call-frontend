"use client";
import {Button} from "@/components/ui/button";
import {CheckCircle, Close, Info, Warning} from "@/components/shared/Icons";
import {toast, ToastBar, Toaster} from "react-hot-toast";
import {TooltipProvider} from "@/components/ui/tooltip";

function Providers({children}: { children: React.ReactNode }) {

    return (
        <>
            <Toaster toastOptions={{
                duration: 5000,
                position: "bottom-center",
                icon: <Info className={"size-5"}/>,
                success: {icon: <CheckCircle className={"size-5"}/>},
                error: {icon: <Warning className={"size-5 fill-destructive"}/>}
            }}>
                {(t) => (
                    <ToastBar toast={t} style={{
                        backgroundColor: "var(--color-background)",
                        color: "var(--color-foreground)",
                        fill: "var(--color-foreground)",
                        border: "1px solid var(--color-border)",
                    }}>
                        {({icon, message}) => (
                            <div className={"flex items-center text-xs md:text-sm gap-10 p-1"}>
                                <div className={"flex items-center gap-1"}>
                                    {icon}
                                    {message}
                                </div>
                                {t.type !== "loading" && t.id !== "notification-permission" && (
                                    <Button size={"icon"} className={"size-7"} onClick={() => toast.dismiss(t.id)}>
                                        <Close className={"size-5"}/>
                                    </Button>
                                )}
                            </div>
                        )}
                    </ToastBar>
                )}
            </Toaster>
            <TooltipProvider>
                {children}
            </TooltipProvider>
        </>
    );
}

export default Providers;