import getDeviceType from "@/core/getDeviceType";
import toast from "react-hot-toast";

interface IShowNotificationParams extends NotificationOptions {
  title: string;
}

async function showNotification({ title, ...options }: IShowNotificationParams): Promise<void> {
  const deviceType = getDeviceType();

  // Changed: Added permission check alongside visibility check
  if (document.visibilityState !== "hidden" || Notification.permission !== "granted") {
    return;
  }

  // Added: Wrapped everything in try-catch for error handling
  try {
    if (deviceType === "desktop") {
      const notification = new Notification(title, {
        icon: "/images/logo-96.png",
        badge: "/images/logo-96.png",
        lang: "fa-IR",
        dir: "rtl",
        ...options,
      });

      notification.addEventListener("click", () => window.focus());

      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.visibilityState === "visible") {
            notification.close();
          }
        },
        { once: true },
      );
    } else {
      const registration = await navigator.serviceWorker.getRegistration();
      // Changed: Added null check with explicit conditional
      if (registration) {
        await registration.showNotification(title, {
          icon: "/images/logo-96.png",
          badge: "/images/logo-96.png",
          lang: "fa-IR",
          dir: "rtl",
          ...options,
        });
      } else {
        throw new Error("No registration found");
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
      console.error(err);
    }
  }
}

export default showNotification;
