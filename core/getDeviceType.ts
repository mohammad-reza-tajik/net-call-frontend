function getDeviceType() {

    const userAgent = navigator.userAgent;
    if (userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        return "mobile"
    } else {
        return "desktop"
    }

}

export default getDeviceType;