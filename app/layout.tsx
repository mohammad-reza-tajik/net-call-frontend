import type {Metadata, Viewport} from "next";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import Providers from "@/components/shared/Providers";
import Header from "@/components/shared/Header";
import Initialize from "@/components/shared/Initialize";

export const metadata: Metadata = {
    title: "lanland",
    description: "make video/audio call and share your screen over your LAN",
};

export const viewport: Viewport = {
    themeColor: "#069f69",
    width: "device-width",
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
    initialScale: 1
}

function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <html lang={"fa"} dir={"rtl"} className={"font-dana-medium"}>
        <body className={"bg-background text-foreground fill-foreground relative"}>
        <div className={"h-screen contained overflow-hidden flex flex-col"}>
            <Providers>
                <Initialize>
                    <Header/>
                    {children}
                </Initialize>
            </Providers>
        </div>
        </body>
        </html>
    );
}

export default RootLayout
