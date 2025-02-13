
interface INotification extends NotificationOptions{
    title: string;
}

function showNotification({title ,...options} : INotification) {
    // only send notification when tab is not visible
    if (document.visibilityState === "hidden") {
        const notification = new Notification(title , {icon : "/images/logo-96.png" , ...options});
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                // The tab has become visible so clear the now-stale Notification.
                notification.close();
            }
        });
    }
}

export default showNotification;