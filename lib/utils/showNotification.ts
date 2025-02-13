import getDeviceType from "@/core/getDeviceType";

interface INotification extends NotificationOptions {
    title: string;
}


async function showNotification({title, ...options}: INotification) {
    const deviceType = getDeviceType();
    // only send notification when tab is not visible(focused);
    if (document.visibilityState === "hidden") {

        if (deviceType === "desktop") {
            const notification = new Notification(title, {
                icon: "/images/logo-96.png",
                badge: "/images/logo-96.png",
                lang: "fa-IR",
                dir: "rtl",
                ...options
            });

            notification.addEventListener("click", () => {
                window.focus();
            })

            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") {
                    // The tab has become visible so clear the now-stale Notification.
                    notification.close();
                }
            });

        } else {

            const registration = await navigator.serviceWorker.getRegistration();
            await registration?.showNotification(title, {
                icon: "/images/logo-96.png",
                badge: "/images/logo-96.png",
                lang: "fa-IR",
                dir: "rtl",
                ...options
            })

        }

    }
}

export default showNotification;