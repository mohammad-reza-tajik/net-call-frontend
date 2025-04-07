"use client";
import type { IFileMessage } from "@/types";
import { Check, DoubleChecks, Download, File as FileIcon } from "@/components/shared/Icons";
import localPeerIdSignal from "@/signals/peer/localPeerId";
import cn from "@/lib/utils/cn";
import makeHumanReadable from "@/lib/utils/makeHumanReadable";
import getTimestamp from "@/lib/utils/getTimeStamp";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";

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
        "flex gap-3 border rounded items-center p-2 w-3/4 relative",
        {
          "bg-muted self-start": message.localPeerId === localPeerIdSignal.value,
        },
        { "self-end": message.localPeerId !== localPeerIdSignal.value },
      )}
    >
      <div className={"absolute h-5 bottom-1 right-1 flex items-center gap-2 "}>
        {message.localPeerId === localPeerIdSignal.value ? message.seen ? <DoubleChecks /> : <Check /> : null}
        <span className={"text-xs"}>{getTimestamp(message.timestamp)}</span>
      </div>
      <div className={"flex-1 flex flex-col gap-2 [direction:ltr] truncate text-xs text-wrap"}>
        <p className={"break-words line-clamp-2 "}>{message.file.name}</p>
        <p>{makeHumanReadable(message.file.size) + "B"}</p>
      </div>
      <AnimatedCircularProgressBar
        className={"size-20 text-sm"}
        max={message.file.size}
        value={message.transferredAmount}
        min={0}
        gaugePrimaryColor={"var(--color-primary)"}
        gaugeSecondaryColor={"var(--color-background)"}
      >
        {}
        {message.transferredAmount < message.file.size ? null : localPeerIdSignal.value !== message.localPeerId ? (
          <a href={createDownloadLink(message.file as File)} download={message.file.name}>
            <Download className={"size-7"} />
          </a>
        ) : (
          <FileIcon className={"size-7"} />
        )}
      </AnimatedCircularProgressBar>
    </div>
  );
}

export default FileMessage;
