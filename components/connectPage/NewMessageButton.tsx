"use client";
import cn from "@/lib/utils/cn";
import haveNewMessageSignal from "@/signals/haveNewMessage";
import { Caret } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import messagesSignal from "@/signals/peer/messages";

interface INewMessageButtonProps {
  chatContainerRef: React.RefObject<HTMLDivElement | null>; // No need for null here since useRef initializes with null
}

function NewMessageButton({ chatContainerRef }: INewMessageButtonProps) {
  useSignals();

  const isLastMessageInView = useSignal(true);

  // Scroll to the last message and reset the new message signal
  const goToLastMessageHandler = () => {
    if (chatContainerRef.current?.lastElementChild) {
      haveNewMessageSignal.value = false;
      chatContainerRef.current.lastElementChild.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // Observe the last message to determine if it's in view
  useSignalEffect(() => {
    if (messagesSignal.value.length === 0 || !chatContainerRef.current) return;

    const observerOptions: IntersectionObserverInit = {
      root: chatContainerRef.current,
      threshold: 0.9, // Trigger when 90% of the last message is visible
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const isVisible = entries[0].isIntersecting;
      isLastMessageInView.value = isVisible;
      // If the last message is in view, reset the new message signal
      if (isVisible) {
        haveNewMessageSignal.value = false;
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const lastMessageElement = chatContainerRef.current.lastElementChild;

    if (lastMessageElement) {
      observer.observe(lastMessageElement);
    }

    // Cleanup observer on unmount or when messages change
    return () => {
      if (lastMessageElement) {
        observer.unobserve(lastMessageElement);
      }
      observer.disconnect();
    };
  });

  return (
    <div
      className={cn(
        "fixed bottom-31 right-0 w-full flex items-center justify-center pointer-events-none", // Position at bottom, prevent blocking chat
        {
          hidden: !haveNewMessageSignal.value || isLastMessageInView.value,
        }
      )}
    >
      <Button
        size={"sm"}
        onClick={goToLastMessageHandler}
        className={"pointer-events-auto"} // Re-enable pointer events for the button
      >
        <Caret className={"rotate-90"} />
        پیام جدید
      </Button>
    </div>
  );
}

export default NewMessageButton;