"use client";
import { Suspense, useEffect } from "react";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import localStreamSignal from "@/signals/localStream";
import iODevicesSignal from "@/signals/iODevices";
import getIODevices from "@/core/getIODevices";
import socketSignal from "@/signals/socket";
import { useSignalEffect } from "@preact/signals-react/runtime";
import { answerSignal, offerSignal } from "@/signals/peer/peerConnection";
import { useRouter } from "next/navigation";
import routerSignal from "@/signals/router";
import { batch } from "@preact/signals-react";
import connectToSocket from "@/core/connectToSocket";
import HangupOnRouteChange from "@/components/shared/HangupOnRouteChange";
import { type Toast, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import visibilitySignal from "@/signals/peer/visibility";
import type { IFriend, TVisibility } from "@/types";
import friendsSignal from "@/signals/peer/friends";
import { z } from "zod";
import { friendSchema, jsonSchema, visibilitySchema } from "@/schemas";
import statusSignal from "@/signals/peer/status";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import iceCandidatesSignal from "@/signals/peer/iceCandidates";
import isLoadedSignal from "@/signals/isLoaded";
import getDeviceType from "@/core/getDeviceType";

interface IInitializerProps {
  children: React.ReactNode;
}

function Initializer({ children }: IInitializerProps) {
  routerSignal.value = useRouter();

  /*
        Boolean signal to track completion of initial setup, including localStorage loading.
        Ensures useSignalEffect hooks only save to localStorage after data is fully loaded,
        preventing overwrite with default or empty values on mount.
  */

  useEffect(() => {
    (async () => {
      try {
        if (typeof navigator.serviceWorker !== "undefined") {
                    await navigator.serviceWorker.register("/sw.js");
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data === "activated") {
              routerSignal.value?.refresh();
            }
          });
        }

                const localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});

        // this is because we need to request notification permission on a user gesture
        if ("Notification" in window && Notification.permission !== "granted") {
          toast(
            (t: Toast) => (
              <div className={"flex items-center gap-2"}>
                <p>دسترسی به اعلان مورد نیاز است</p>
                <Button
                  size={"sm"}
                  className={"text-xs"}
                  onClick={async () => {
                    const permission = await Notification.requestPermission();
                    if (permission !== "granted") {
                      throw new Error("دسترسی به اعلان مورد نیاز است");
                    }
                    toast.dismiss(t.id);
                  }}
                >
                  دادن مجوز
                </Button>
              </div>
            ),
            { id: "notification-permission", duration: Infinity },
          );
        }

        let visibility = localStorage.getItem("visibility") as TVisibility;

        const validatedVisibility = visibilitySchema.safeParse(visibility);

        if (!validatedVisibility.success) {
          visibility = "visible";
          localStorage.setItem("visibility", visibility);
        }

        let storedFriends = localStorage.getItem("friends") || "[]";
        const validatedStoredFriends = jsonSchema.safeParse(storedFriends);

        if (!validatedStoredFriends.success) {
          storedFriends = "[]";
          localStorage.setItem("friends", storedFriends);
        }

        let friends: IFriend[] = [];

        friends = JSON.parse(storedFriends);
        const validatedFriends = z.array(friendSchema).safeParse(friends);
        if (!validatedFriends.success) {
          console.log(validatedFriends);
          friends = [];
          localStorage.setItem("friends", JSON.stringify(friends));
        }

        let localPeerId = localStorage.getItem("localPeerId") as string;

        const validatedLocalPeerId = z.string().uuid().safeParse(localPeerId);

        if (!validatedLocalPeerId.success) {
          localPeerId = localStream.id;
          localStorage.setItem("localPeerId", localPeerId);
        }
        const deviceType = getDeviceType();
        const devices = await getIODevices();
        connectToSocket({ localPeerId, deviceType, visibility });

        batch(() => {
          localPeerIdSignal.value = localPeerId;
          localStreamSignal.value = localStream;
          iODevicesSignal.value = devices;
          visibilitySignal.value = visibility;
          friendsSignal.value = friends;
        });
        /*
            had to use set it after batch because otherwise the friendsSignal-setting useSignalEffect hooks would run and overwrite the friends in local storage
        */
        isLoadedSignal.value = true;
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          console.error(err);
        }
      }
    })();
  }, []);

  useSignalEffect(() => {
    if (isLoadedSignal.value) {
      localStorage.setItem("friends", JSON.stringify(friendsSignal.value));
    }
  });

  useSignalEffect(() => {
    if (iceCandidatesSignal.value.length === 0 && !socketSignal.value) return;

    if (offerSignal.peek() && statusSignal.peek()?.endsWith(":send")) {
      socketSignal.value!.emit("requestToServer", {
        iceCandidates: iceCandidatesSignal.value,
        offer: offerSignal.peek(),
        localPeerId: localPeerIdSignal.peek(),
        remotePeerId: remotePeerIdSignal.peek(),
        status: statusSignal.peek(),
      });
    } else if (answerSignal.peek() && statusSignal.peek()?.endsWith(":receive")) {
      socketSignal.value!.emit("responseToServer", {
        iceCandidates: iceCandidatesSignal.value,
        answer: answerSignal.peek(),
        localPeerId: localPeerIdSignal.peek(),
        remotePeerId: remotePeerIdSignal.peek(),
        status: statusSignal.peek(),
      });
    }
  });

  return (
    <>
      <Suspense>
        <HangupOnRouteChange />
      </Suspense>
      {children}
    </>
  );
}

export default Initializer;
