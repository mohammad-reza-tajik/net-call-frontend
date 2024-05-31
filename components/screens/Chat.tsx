"use client"
import {Button} from "@/components/ui/button";
import {Paperclip, PaperPlane} from "@/components/shared/Icons";
import {useRef, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {chatChannelSignal, fileChannelSignal} from "@/signals/peer/peerConnection";
import messagesSignal from "@/signals/peer/messages";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import {useSignals} from "@preact/signals-react/runtime";
import type {IFileMessage, ITextMessage} from "@/types";
import FileMessage from "@/components/connectPage/FileMessage";
import TextMessage from "@/components/connectPage/TextMessage";

function Chat() {

    useSignals();

    const textMessageRef = useRef<HTMLTextAreaElement>(null);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | undefined>(undefined);

    const sendMessageHandler = () => {

        if (file && fileBuffer) {
            // send file data first
            const fileData = {
                name : file.name,
                mimeType : file.type,
            }
            console.log("file buffer")
            fileChannelSignal.value?.send(fileBuffer);
            console.log("file Data")
            fileChannelSignal.value?.send(JSON.stringify(fileData));

            const fileMessage : IFileMessage = {
                file,
                type : "file",
                localPeerId : localPeerIdSignal.value,
            }

            messagesSignal.value = [...messagesSignal.value, fileMessage];

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
            // console.log(fileData)
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
                            return <TextMessage key={index} message={message} />
                        }
                        return <FileMessage key={index} message={message} />
                    })
                }
            </div>
            <div className={"flex items-center gap-2 p-5 border-t"}>
                <Button size={"icon"} onClick={sendMessageHandler}>
                    <PaperPlane className={"size-7"}/>
                </Button>
                {
                    !file && <Textarea ref={textMessageRef} className={"flex-1"}/>
                }
                <Button size={"icon"} onClick={filePickerHandler}>
                    <Paperclip className={"size-7"}/>
                </Button>
            </div>

        </>
    )
}

export default Chat;