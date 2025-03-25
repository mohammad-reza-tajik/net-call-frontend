"use client";

import AudioCall from "@/components/screens/AudioCall";
import cn from "@/lib/utils/cn";
import ScreenSend from "@/components/screens/ScreenSend";
import ActionBar from "@/components/connectPage/ActionBar";
import { Suspense, useEffect, useRef } from "react";
import createAnswer from "@/core/createAnswer";
import statusSignal from "@/signals/peer/status";
import { connectionStateSignal, signalingStateSignal } from "@/signals/peer/peerConnection";
import currentRequestSignal from "@/signals/peer/currentRequest";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import remoteVideoRefSignal from "@/signals/remoteVideoRef";
import localVideoRefSignal from "@/signals/localVideoRef";
import Chat from "@/components/screens/Chat";
import Drawer from "@/components/shared/Drawer";
import { isChatDrawerOpenSignal } from "@/signals/drawer";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import hangup from "@/core/hangup";
import PigGame from "@/components/screens/PigGame";
import RemotePeerIdUpdater from "@/components/connectPage/RemotePeerIdUpdater";
import { Fullscreen } from "@/components/shared/Icons";

const HIDE_DELAY = 3000; // 3 seconds
function ConnectScreen() {
  useSignals();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const localHiderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const remoteHiderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showOverlayLocalSignal = useSignal(false);
  const showOverlayRemoteSignal = useSignal(false);

  useEffect(() => {
    remoteVideoRefSignal.value = remoteVideoRef;
    localVideoRefSignal.value = localVideoRef;
  }, []);

  useSignalEffect(() => {
    if (currentRequestSignal.value) {
      createAnswer({ request: currentRequestSignal.value });
    }
  });

  const toggleOverlay = (type: "local" | "remote") => {
    if (type === "local") {
      clearTimeout(localHiderTimeoutRef.current!);
      if (showOverlayLocalSignal.value) {
        showOverlayLocalSignal.value = false;
        localHiderTimeoutRef.current = null;
      } else {
        // If overlay is hidden, show it and set timeout
        showOverlayLocalSignal.value = true;
        remoteHiderTimeoutRef.current = setTimeout(() => (showOverlayLocalSignal.value = false), HIDE_DELAY);
      }
    } else {
      clearTimeout(remoteHiderTimeoutRef.current!);
      if (showOverlayRemoteSignal.value) {
        showOverlayRemoteSignal.value = false;
        localHiderTimeoutRef.current = null;
      } else {
        showOverlayRemoteSignal.value = true;
        remoteHiderTimeoutRef.current = setTimeout(() => (showOverlayRemoteSignal.value = false), HIDE_DELAY);
      }
    }
  };

  const toggleFullscreen = (type: "local" | "remote") => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      // Hide overlay immediately when entering fullscreen
      if (type === "local") {
        localVideoRef.current?.parentElement?.requestFullscreen();
      } else {
        remoteVideoRef.current?.parentElement?.requestFullscreen();
      }
    }
  };

  const renderScreen = () => {
    if (connectionStateSignal.value === "connected") {
      if (statusSignal.value === "screen:send") {
        return <ScreenSend />;
      } else if (statusSignal.value!.startsWith("audio:")) {
        return <AudioCall />;
      } else if (statusSignal.value!.startsWith("video:") || statusSignal.value === "screen:receive") {
        return; // Stay on current screen
      } else if (statusSignal.value?.startsWith("game:")) {
        return <PigGame />;
      }
    } else {
      return (
        <div className={"flex flex-col gap-5 justify-center items-center text-sm md:text-xl size-full relative"}>
          <Loader
            className={cn(
              "size-60 lg:size-80 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 pointer-events-none",
              {
                hidden: !statusSignal.value,
              },
            )}
          />
          {!statusSignal.value && <>برای شروع ارتباط یک از گزینه های زیر را انتخاب کنید</>}
          {connectionStateSignal.value === "connecting" && (
            <>
              <p>در حال اتصال ...</p>
            </>
          )}
          {signalingStateSignal.value === "have-local-offer" && connectionStateSignal.value !== "connecting" && (
            <>
              <p>در انتظار پاسخ ...</p>
              <Button onClick={() => hangup(true)}>انصراف</Button>
            </>
          )}
        </div>
      );
    }
  };

  const closeDrawerHandler = () => {
    isChatDrawerOpenSignal.value = false;
  };

  return (
    <>
      <Suspense>
        <RemotePeerIdUpdater />
      </Suspense>
      <Drawer isOpen={isChatDrawerOpenSignal.value} onClose={closeDrawerHandler} direction={"left"} title={"چت"}>
        <Chat />
      </Drawer>
      <section className={"@container relative overflow-hidden h-[calc(100dvh-114px)]"}>
        {renderScreen()}
        {/* Local Video Container */}
        <div
          className={"absolute top-1 right-1 z-30 max-w-1/3 @lg:max-w-1/4 overflow-hidden"}
          onClick={() => toggleOverlay("local")}
        >
          <video
            ref={localVideoRef}
            autoPlay
            className={cn("size-full object-contain ", {
              hidden: !statusSignal.value?.startsWith("video:") || connectionStateSignal.value !== "connected",
            })}
          />
          {/* local Video overlay */}
          <div
            className={cn(
              "absolute inset-0 flex bg-background justify-center items-center transition-opacity duration-300",
              showOverlayLocalSignal.value ? "opacity-60" : "opacity-0 pointer-events-none",
            )}
          >
            <Button size="icon" onClick={() => toggleFullscreen("local")}>
              <Fullscreen className={"size-7"} />
            </Button>
          </div>
        </div>

        {/* Remote Video Container */}
        <div className={"relative size-full overflow-hidden"} onClick={() => toggleOverlay("remote")}>
          <video
            ref={remoteVideoRef}
            autoPlay
            className={cn("size-full object-contain", {
              hidden:
                (!statusSignal.value?.startsWith("video:") && statusSignal.value !== "screen:receive") ||
                connectionStateSignal.value !== "connected",
            })}
          />
          {/* Remote Video overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-background flex justify-center items-center transition-opacity duration-300",
              showOverlayRemoteSignal.value ? "opacity-60" : "opacity-0 pointer-events-none",
            )}
          >
            <Button size="icon" onClick={() => toggleFullscreen("remote")}>
              <Fullscreen className={"size-7"} />
            </Button>
          </div>
        </div>
      </section>
      <ActionBar />
    </>
  );
}

export default ConnectScreen;
