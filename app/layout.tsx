import type {Metadata, Viewport} from "next";
import "@/styles/globals.css";
import Providers from "@/components/shared/Providers";
import Header from "@/components/shared/Header";
import Initializer from "@/components/shared/Initializer";

export const metadata: Metadata = {
    title: "Net Call",
    description: "peer to peer video/audio call and share screen",
    keywords: ["video-call", "audio-call", "webrtc", "share-screen"],
    manifest: "/manifest.json",
    icons: {
        icon: "/images/logo-96.png",
        apple: [
            {url: "/images/logo-96.png", sizes: "96x96", type: "image/png"},
            {url: "/images/logo-192.png", sizes: "192x192", type: "image/png"},
        ]
    }
};

export const viewport: Viewport = {
    themeColor: "#485dd5",
    width: "device-width",
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
    initialScale: 1
};

function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <html lang={"fa"} dir={"rtl"} className={"font-dana-medium"}>
        <body className={"bg-background text-foreground fill-foreground relative"}>
        <div className={"h-[100dvh] w-screen contained overflow-hidden flex flex-col"}>
            <Providers>
                <Initializer>
                    <Header/>
                    {children}
                </Initializer>
            </Providers>
        </div>
        </body>
        </html>
    );
}

export default RootLayout;
