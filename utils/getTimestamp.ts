import dayjs from "dayjs";

function getTimestamp(date : Date) {
    return `${dayjs(date).hour().toString().padStart(2,"0")}:${dayjs(date).minute().toString().padStart(2,"0")}`;
}

export default getTimestamp