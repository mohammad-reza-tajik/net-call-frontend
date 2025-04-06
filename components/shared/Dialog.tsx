"use client";

import { batch, signal } from "@preact/signals-react";
import cn from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Close } from "@/components/shared/Icons";
import { useSignals } from "@preact/signals-react/runtime";

interface IOpenDialogParams {
  title: React.ReactNode;
  content: React.ReactNode;
}

const isOpenSignal = signal(false);
const titleSignal = signal<React.ReactNode>("");
const contentSignal = signal<React.ReactNode>("");

export const openDialog = ({ title, content }: IOpenDialogParams) => {
  batch(() => {
    isOpenSignal.value = true;
    titleSignal.value = title;
    contentSignal.value = content;
  });
};

export const closeDialog = () => {
  batch(() => {
    isOpenSignal.value = false;
    titleSignal.value = "";
    contentSignal.value = "";
  });
};

function Dialog({ ref }: React.ComponentProps<"div">) {
  useSignals();
  return (
    <div
      className={cn("flex justify-center items-center absolute inset-0", {
        "opacity-0 pointer-events-none": !isOpenSignal.value,
      })}
      role={"dialog"}
      aria-labelledby={"dialog-title"}
      aria-describedby={"dialog-description"}
    >
      {/* Dialog overlay */}
      <div
        className={"fixed inset-0 bg-foreground z-40 opacity-60"}
        onClick={closeDialog}
        aria-hidden={!isOpenSignal.value} // Hide from screen readers when closed
      />

      <div
        ref={ref}
        className={cn("bg-background z-50 flex flex-col rounded transition-all opacity-0", {
          "opacity-100": isOpenSignal.value,
        })}
      >
        <header className={"flex items-center border-b p-2"}>
          <Button size={"icon"} onClick={closeDialog} aria-label={"Close"} variant={"outline"}>
            <Close />
          </Button>
          <div id={"dialog-title"} className={"flex-1 text-center text-sm px-4"}>
            {titleSignal}
          </div>
        </header>
        <div id={"dialog-description"} className={"flex-1 p-5"}>
          {contentSignal}
        </div>
      </div>
    </div>
  );
}

export default Dialog;
