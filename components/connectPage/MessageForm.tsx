"use client";
import sendInChunks from "@/core/sendInChunks";
import cn from "@/lib/utils/cn";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import messagesSignal from "@/signals/peer/messages";
import { chatChannelSignal } from "@/signals/peer/peerConnection";
import type { IFileData, ITextMessage } from "@/types";
import { useSignal } from "@preact/signals-react";
import { Close, Paperclip, PaperPlane } from "@/components/shared/Icons";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSignals } from "@preact/signals-react/runtime";
import Loader from "@/components/shared/Loader";

function MessageForm() {
  useSignals();

  const textMessageRef = useRef<HTMLTextAreaElement>(null);
  const fileSignal = useSignal<File | undefined>(undefined);
  const fileBufferSignal = useSignal<ArrayBuffer | undefined>(undefined);
  const isReadingFileSignal = useSignal(false);

  const sendMessageHandler = async () => {
    try {
      if (fileSignal.value && fileBufferSignal.value) {
        // send file data first
        const fileData: IFileData = {
          name: fileSignal.value.name,
          mimeType: fileSignal.value.type,
          size: fileSignal.value.size,
          timestamp: new Date(),
        };

        await sendInChunks({ fileBuffer: fileBufferSignal.value, fileData });

        fileSignal.value = undefined;
        fileBufferSignal.value = undefined;
      } else {
        if (!textMessageRef.current?.value.trim()) return;

        const textMessage: ITextMessage = {
          type: "text",
          text: textMessageRef.current.value,
          localPeerId: localPeerIdSignal.value,
          timestamp: new Date(),
        };

        chatChannelSignal.value?.send(JSON.stringify(textMessage));

        messagesSignal.value = [...messagesSignal.value, textMessage];

        textMessageRef.current.value = "";
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filePickerHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    isReadingFileSignal.value = true;
    const chosenFile = event.target.files?.[0];
    if (chosenFile) {
      fileSignal.value = chosenFile;
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        if (!event.target?.result || typeof event.target.result === "string") return;
        fileBufferSignal.value = event.target.result;
        isReadingFileSignal.value = false;
      });
      reader.readAsArrayBuffer(chosenFile);
    }
  };

  return (
    <>
      <div className={"flex items-center gap-2 p-5 border-t"}>
        <Button size={"icon"} onClick={sendMessageHandler} variant={"outline"}>
          <PaperPlane className={"size-7"} />
        </Button>

        {isReadingFileSignal.value ? (
          <div className={"flex items-center justify-center p-3 h-20 flex-1"}>
            <Loader className={"size-10"} />
          </div>
        ) : !fileSignal.value ? (
          <Textarea ref={textMessageRef} className={"flex-1"} />
        ) : (
          <div className={"flex items-center justify-between p-3 h-20 flex-1 border rounded overflow-hidden"}>
            <p className={"text-sm w-2/3 truncate"} title={fileSignal.value.name}>
              فایل انتخابی :{fileSignal.value.name}
            </p>
            <Button size={"icon"} variant={"outline"} onClick={() => (fileSignal.value = undefined)}>
              <Close className={"size-4"} />
            </Button>
          </div>
        )}

        <input id={"file-upload"} type={"file"} className={"hidden"} onChange={filePickerHandler} />

        <Button size={"icon"} className={cn({ hidden: fileSignal.value })} variant={"outline"}>
          <label htmlFor="file-upload">
            <Paperclip className={"size-7"} />
          </label>
        </Button>
      </div>
    </>
  );
}

export default MessageForm;
