"use client";
import messagesSignal from "@/signals/peer/messages";
import {useSignals} from "@preact/signals-react/runtime";
import FileMessage from "@/components/connectPage/FileMessage";
import TextMessage from "@/components/connectPage/TextMessage";
import MessageForm from "@/components/connectPage/MessageForm";


function Chat() {

    useSignals();

    return (
        <>
            <div className={"@container flex flex-col flex-1 overflow-y-auto overflow-x-auto gap-3 p-2 relative"} id="chat-container">
                {
                    messagesSignal.value.map((message, index) => {
                        if (message.type === "text") {
                            return <TextMessage key={index} message={message}/>;
                        }
                        return <FileMessage key={index} message={message}/>;
                    })
                }
            </div>
            <MessageForm />
            
        </>
    );
}

export default Chat;