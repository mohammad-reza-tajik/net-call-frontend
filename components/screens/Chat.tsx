"use client";
import {Button} from "@/components/ui/button";
import {Close, Paperclip, PaperPlane} from "@/components/shared/Icons";
import {useRef} from "react";
import {Textarea} from "@/components/ui/textarea";
import {chatChannelSignal} from "@/signals/peer/peerConnection";
import messagesSignal from "@/signals/peer/messages";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import {useSignals} from "@preact/signals-react/runtime";
import type {IFileData, ITextMessage} from "@/types";
import FileMessage from "@/components/connectPage/FileMessage";
import TextMessage from "@/components/connectPage/TextMessage";
import cn from "@/lib/utils/cn";
import sendInChunks from "@/core/sendInChunks";
import {useSignal} from "@preact/signals-react";

function Chat() {

    useSignals();

    const textMessageRef = useRef<HTMLTextAreaElement>(null);
    const fileSignal = useSignal<File | undefined>(undefined);
    const fileBufferSignal = useSignal<ArrayBuffer | undefined>(undefined);

    const sendMessageHandler = async () => {
        try {
            if (fileSignal.value && fileBufferSignal.value) {
                // send file data first
                const fileData: IFileData = {
                    name: fileSignal.value.name,
                    mimeType: fileSignal.value.type,
                    size: fileSignal.value.size,
                    timestamp : new Date()
                };

                await sendInChunks({fileBuffer: fileBufferSignal.value, fileData});

                fileSignal.value = undefined;
                fileBufferSignal.value = undefined;
            } else {

                if (!textMessageRef.current?.value.trim()) return;

                const textMessage: ITextMessage = {
                    type: "text",
                    text: textMessageRef.current.value,
                    localPeerId: localPeerIdSignal.value,
                    timestamp : new Date()
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
        const chosenFile = event.target.files?.[0];
        if (chosenFile) {
            fileSignal.value = chosenFile;
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
                if (!event.target?.result || typeof event.target.result === "string") return;
                fileBufferSignal.value = event.target.result;
            });
            reader.readAsArrayBuffer(chosenFile);

        }
    };

    return (
        <>
            <div className={"@container flex flex-col flex-1 overflow-y-auto overflow-x-auto gap-3 p-2"}>
                {
                    messagesSignal.value.map((message, index) => {
                        if (message.type === "text") {
                            return <TextMessage key={index} message={message}/>;
                        }
                        return <FileMessage key={index} message={message}/>;
                    })
                }
            </div>
            <div className={"flex items-center gap-2 p-5 border-t"}>
                <Button size={"icon"} onClick={sendMessageHandler}>
                    <PaperPlane className={"size-7"}/>
                </Button>
                {
                    !fileSignal.value ? <Textarea ref={textMessageRef} className={"flex-1"}/> :
                        <div className={"flex items-center justify-between p-3 flex-1 border rounded"}>
                            <p className={"text-sm"}>
                                فایل انتخابی :
                                {fileSignal.value.name}
                            </p>
                            <Button size={"icon"} variant={"outline"} onClick={() => fileSignal.value = undefined}>
                                <Close className={"size-4"}/>
                            </Button>
                        </div>
                }

                <input
                    id={"file-upload"}
                    type={"file"}
                    className={"hidden"}
                    onChange={filePickerHandler}
                />

                <Button size={"icon"} className={cn({"hidden": fileSignal.value})}>
                    <label htmlFor="file-upload">
                        <Paperclip className={"size-7"}/>
                    </label>
                </Button>
            </div>

        </>
    );
}

export default Chat;