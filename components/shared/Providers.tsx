"use client";
import {Button} from "@/components/ui/button";
import {CheckCircle, Close, Info, Warning} from "@/components/shared/Icons";
import {toast, ToastBar, Toaster} from "react-hot-toast";
import {TooltipProvider} from "@/components/ui/tooltip";
import {isRequestsDrawerOpenSignal} from "@/signals/drawer";
import receivedRequestsSignal from "@/signals/peer/receivedRequests";
import RequestItem from "@/components/shared/RequestItem";
import Drawer from "@/components/shared/Drawer";
import {useSignals} from "@preact/signals-react/runtime";

interface IProvidersProps {
    children: React.ReactNode;
}

function Providers({children}: IProvidersProps) {

    useSignals();

    const closeDrawerHandler = () => {
        isRequestsDrawerOpenSignal.value = false;
    };

    return (
        <>
            <TooltipProvider>
                <Toaster toastOptions={{
                    duration: 5000,
                    position: "bottom-center",
                    icon: <Info className={"size-5"}/>,
                    success: {icon: <CheckCircle className={"size-5"}/>},
                    error: {icon: <Warning className={"size-5"}/>}
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

                <Drawer isOpen={isRequestsDrawerOpenSignal.value}
                        onClose={closeDrawerHandler}
                        direction={"left"}
                        title={"درخواست های دریافتی"}
                >
                    {
                        receivedRequestsSignal.value.length === 0 ?
                            <p className={"text-center text-sm p-2"}>هیچ درخواستی وجود ندارد</p> :
                            receivedRequestsSignal.value.map((request, index) => {
                                return <RequestItem request={request} key={index}/>;
                            })
                    }
                </Drawer>

                {children}
            </TooltipProvider>
        </>
    );
}

export default Providers;