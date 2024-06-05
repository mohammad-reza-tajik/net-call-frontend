"use client"
import {Button} from "@/components/ui/button";
import {Close, Paperclip, PaperPlane} from "@/components/shared/Icons";
import {useRef, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {chatChannelSignal} from "@/signals/peer/peerConnection";
import messagesSignal from "@/signals/peer/messages";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import {useSignals} from "@preact/signals-react/runtime";
import type {IFileData, ITextMessage} from "@/types";
import FileMessage from "@/components/connectPage/FileMessage";
import TextMessage from "@/components/connectPage/TextMessage";
import {cn} from "@/lib/utils";
import sendInChunks from "@/utils/sendInChunks";

function Chat() {

    useSignals();

    const textMessageRef = useRef<HTMLTextAreaElement>(null);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | undefined>(undefined);

    const sendMessageHandler = async () => {

        if (file && fileBuffer) {
            // send file data first
            const fileData : IFileData = {
                name: file.name,
                mimeType: file.type,
                size : file.size
            }

            await sendInChunks({fileBuffer,fileData});

            setFile(undefined);
            setFileBuffer(undefined);
        } else {

            if (!textMessageRef.current?.value) return

            const textMessage: ITextMessage = {
                type: "text",
                text: textMessageRef.current.value,
                localPeerId: localPeerIdSignal.value
            }

            chatChannelSignal.value?.send(JSON.stringify(textMessage));

            messagesSignal.value = [...messagesSignal.value, textMessage];

            textMessageRef.current.value = "";
        }
    }

    const filePickerHandler = async () => {
        try {
            const reader = new FileReader();
            const [fileHandle] = await window.showOpenFilePicker({multiple: false});
            const chosenFile = await fileHandle.getFile();
            if (!chosenFile) return
            setFile(chosenFile);
            reader.addEventListener("load", (event) => {
                if (!event.target?.result || typeof event.target.result === "string") return
                setFileBuffer(event.target.result);
            })
            reader.readAsArrayBuffer(chosenFile);

        } catch (err) {
            console.log("user didn't pick any files");
        }

    }

    return (
        <>
            <div className={"flex flex-col flex-1 overflow-y-auto overflow-x-hidden gap-3"}>
                {
                    messagesSignal.value.map((message, index) => {
                        if (message.type === "text") {
                            return <TextMessage key={index} message={message}/>
                        }
                        return <FileMessage key={index} message={message}/>
                    })
                }
            </div>
            <div className={"flex items-center gap-2 p-5 border-t"}>
                <Button size={"icon"} onClick={sendMessageHandler}>
                    <PaperPlane className={"size-7"}/>
                </Button>
                {
                    !file ? <Textarea ref={textMessageRef} className={"flex-1"}/> :
                        <div className={"flex items-center justify-between p-3 flex-1 border rounded"}>
                            <p className={"text-sm"}>
                                فایل انتخابی :
                                {file.name.slice(8)}
                            </p>
                            <Button size={"icon"} variant={"outline"} onClick={() => setFile(undefined)}>
                                <Close className={"size-4"}/>
                            </Button>
                        </div>
                }
                <Button size={"icon"} onClick={filePickerHandler} className={cn({"hidden": file})}>
                    <Paperclip className={"size-7"}/>
                </Button>
            </div>

        </>
    )
}

export default Chat;