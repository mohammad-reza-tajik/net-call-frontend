"use client"
import type {IFileMessage} from "@/types";
import {Check, DoubleChecks, Download, File as FileIcon} from "@/components/shared/Icons";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import makeHumanReadable from "@/utils/makeHumanReadable";
import {toast} from "react-toastify";

interface IFileMessageProps {
    message: IFileMessage
}

function FileMessage({message : {file , transferredAmount , localPeerId , seen}}: IFileMessageProps) {

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
            className={cn("flex flex-col gap-3 border rounded w-max items-center justify-center py-3 px-5",
                {"bg-primary text-primary-foreground": localPeerId === localPeerIdSignal.value},
                {"self-end": localPeerId !== localPeerIdSignal.value})}>
            <FileIcon className={"size-7"}/>
            <p className={"text-xs"}>
                {file.name}
            </p>
            <p className={"text-xs"}>
                {transferredAmount < file.size ? `${makeHumanReadable(transferredAmount)}/${makeHumanReadable(file.size)}`: makeHumanReadable(file.size) }
            </p>
            {
                localPeerIdSignal.value !== localPeerId && transferredAmount >= file.size ?
                    <Button variant={"outline"} onClick={() => saveFile(file as File)} className={"gap-2"}>
                        <Download className={"size-5"}/>
                        دریافت
                    </Button> : null
            }
            {
                localPeerId === localPeerIdSignal.value ?
                    seen ? <DoubleChecks className={"self-start"}/> :
                        <Check className={"self-start"}/> :
                    null
            }
        </div>
    )
}

export default FileMessage;