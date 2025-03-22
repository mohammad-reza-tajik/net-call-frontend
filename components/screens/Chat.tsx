"use client";
import messagesSignal from "@/signals/peer/messages";
import { useSignals } from "@preact/signals-react/runtime";
import FileMessage from "@/components/connectPage/FileMessage";
import TextMessage from "@/components/connectPage/TextMessage";
import MessageForm from "@/components/connectPage/MessageForm";
import { useRef } from "react";
import NewMessageButton from "@/components/connectPage/NewMessageButton";

function Chat() {
  useSignals();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        className={"@container flex flex-col flex-1 overflow-y-auto overflow-x-auto gap-3 p-2"}
        ref={chatContainerRef}
      >
        {messagesSignal.value.map((message, index) => {
          if (message.type === "text") {
            return <TextMessage key={index} message={message} />;
          }
          return <FileMessage key={index} message={message} />;
        })}
      </div>
      <NewMessageButton chatContainerRef={chatContainerRef} />
      <MessageForm />
    </>
  );
}

export default Chat;
