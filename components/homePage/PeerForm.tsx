"use client";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import remotePeerIdSignal from "@/signals/peer/remotePeerId";
import routerSignal from "@/signals/router";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import buildURL from "@/lib/utils/buildURL";
import { z } from "zod";

function PeerForm() {
  useSignals();
  const remotePeerIdRef = useRef<HTMLInputElement>(null);

  const submitRemotePeerIdHandler = () => {
    try {
      if (!remotePeerIdRef.current?.value) {
        return;
      }

      const validatedLocalPeerId = z.string().uuid().parse(remotePeerIdRef.current.value);

      if (validatedLocalPeerId === localPeerIdSignal.value) {
        throw new Error("آیدی وارد شده صحیح نیست");
      }

      const peerURL = buildURL({
        query: {
          remotePeerId: validatedLocalPeerId,
        },
        url: "/connect",
      });

      remotePeerIdSignal.value = validatedLocalPeerId;
      remotePeerIdRef.current.value = "";
      routerSignal.value!.push(peerURL);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        console.error(err);
      }
    }
  };

  return (
    <div className={"flex flex-col justify-center items-center py-5 md:py-10 gap-5 border rounded"}>
      <Input className={"w-3/4 md:w-80 p-7"} ref={remotePeerIdRef} placeholder={"آیدی دستگاه ..."} />
      <Button onClick={submitRemotePeerIdHandler} size={"lg"} variant={"outline"}>
        تایید
      </Button>
    </div>
  );
}

export default PeerForm;
