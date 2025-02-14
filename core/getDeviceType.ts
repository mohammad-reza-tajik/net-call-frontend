function getDeviceType() {

    if (typeof window === "undefined") {
        return "desktop"; // or handle accordingly
    }

    const userAgent = navigator.userAgent;
    if (userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        return "mobile"
    } else {
        return "desktop"
    }

}

export default getDeviceType;