import dayjs from "dayjs";

function getTimestamp(date : Date) {
    return `${dayjs(date).hour()}:${dayjs(date).minute()}`;
}

export default getTimestamp