"use client";
import type { IFileMessage } from "@/types";
import { Check, DoubleChecks, Download, File as FileIcon } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import cn from "@/lib/utils/cn";
import makeHumanReadable from "@/lib/utils/makeHumanReadable";
import getTimestamp from "@/lib/utils/getTimeStamp";

interface IFileMessageProps {
    message: IFileMessage;
}

function FileMessage({ message }: IFileMessageProps) {
    const createDownloadLink = (file: File): string => {
        // Create a Blob URL for the file
        const blob = new Blob([file], { type: file.type });
        return URL.createObjectURL(blob);
    };

    return (
        <div
            className={cn(
                "flex flex-col gap-3 border rounded items-center justify-center py-3 px-5 max-w-3/4",
                {
                    "bg-primary text-primary-foreground":
                        message.localPeerId === localPeerIdSignal.value,
                },
                { "self-end": message.localPeerId !== localPeerIdSignal.value },
            )}
        >
            <FileIcon className={"size-7"} />
            <p className={"text-xs [direction:ltr] text-wrap text-center break-words"}>{message.file.name}</p>
            <p className={"text-xs [direction:ltr] text-wrap"}>
                {message.transferredAmount < message.file.size
                    ? `${makeHumanReadable(message.transferredAmount)}/${makeHumanReadable(message.file.size)}`
                    : makeHumanReadable(message.file.size)}
            </p>
            {localPeerIdSignal.value !== message.localPeerId && message.transferredAmount >= message.file.size ? (
                <Button variant={"outline"} className={"gap-2"} asChild>
                    <a href={createDownloadLink(message.file as File)} download={message.file.name}>
                        <Download className={"size-5"} />
                        دریافت
                    </a>
                </Button>
            ) : null}
            <div className={"flex items-center gap-2 self-start"}>
                {message.localPeerId === localPeerIdSignal.value ? message.seen ? <DoubleChecks /> : <Check /> : null}
                <span className={"text-xs"}>{getTimestamp(message.timestamp)}</span>
            </div>
        </div>
    );
}

export default FileMessage;
