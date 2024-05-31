import type {IFileMessage} from "@/types";
import {Download, File} from "@/components/shared/Icons";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import makeHumanReadable from "@/utils/makeHumanReadable";

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
    }

    return (
        <div
            className={cn("flex flex-col gap-3 border rounded w-max items-center justify-center py-3 px-5",
                {"bg-primary text-primary-foreground": message.localPeerId === localPeerIdSignal.value},
                {"self-end": message.localPeerId !== localPeerIdSignal.value})}>
            <File className={"size-7"}/>
            <p className={"text-xs"}>
                {message.file.name}
            </p>
            <p className={"text-xs"}>
                {makeHumanReadable(message.file.size)}
            </p>
            <Button variant={"outline"} onClick={() => saveFile(message.file)} className={"gap-2"}>
                <Download className={"size-5"}/>
                دریافت
            </Button>
        </div>


    )
}

export default FileMessage;