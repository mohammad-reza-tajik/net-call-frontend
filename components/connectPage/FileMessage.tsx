"use client"
import type {IFileMessage} from "@/types";
import {Check, DoubleChecks, Download, File as FileIcon} from "@/components/shared/Icons";
import {Button} from "@/components/ui/button";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import  cn from "@/lib/utils/cn";
import makeHumanReadable from "@/lib/utils/makeHumanReadable";
import getTimestamp from "@/lib/utils/getTimeStamp";
import {toast} from "react-hot-toast";

interface IFileMessageProps {
    message: IFileMessage
}

function FileMessage({message}: IFileMessageProps) {

    const saveFile = async (file: File) => {
        // create a new handle
        const newHandle = await window.showSaveFilePicker({suggestedName: file.name});

        // create a FileSystemWritableFileStream to write to
        const writableStream = await newHandle.createWritable();

        // write our file
        await writableStream.write(file);

        // close the file and write the contents to disk.
        await writableStream.close();

        toast.success("دانلود انجام شد");
    }

    return (
        <div
            className={cn("flex flex-col gap-3 border rounded items-center justify-center py-3 px-5 max-w-3/4",
                {"bg-primary text-primary-foreground fill-primary-foreground": message.localPeerId === localPeerIdSignal.value},
                {"self-end": message.localPeerId !== localPeerIdSignal.value})}>
            <FileIcon className={"size-7"}/>
            <p className={"text-xs [direction:ltr] truncate"}>
                {message.file.name}
            </p>
            <p className={"text-xs [direction:ltr]"}>
                {message.transferredAmount < message.file.size ? `${makeHumanReadable(message.transferredAmount)}/${makeHumanReadable(message.file.size)}` : makeHumanReadable(message.file.size)}
            </p>
            {
                localPeerIdSignal.value !== message.localPeerId && message.transferredAmount >= message.file.size ?
                    <Button variant={"outline"} onClick={() => saveFile(message.file as File)} className={"gap-2"}>
                        <Download className={"size-5"}/>
                        دریافت
                    </Button> : null
            }
            <div className={"flex items-center gap-2 self-start"}>

                {
                    message.localPeerId === localPeerIdSignal.value ?
                        message.seen ? <DoubleChecks/> :
                            <Check/> :
                        null
                }
                <span className={"text-xs"}>{getTimestamp(message.timestamp)}</span>
            </div>
        </div>
    )
}

export default FileMessage;