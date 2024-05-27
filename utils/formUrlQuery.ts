import qs from "query-string";
interface Config {
    currentParams? : string;
    params?: Record<string, string | number>;
    hash?:string;
}


const formUrlQuery = ({params , currentParams} : Config = {} ) : string => {
    const query = qs.parse(currentParams || "");

    if (params) {
        Object.keys(params).forEach(key => {
            query[key] = String(params[key]);
        });
    }
    return qs.stringifyUrl({
        url: window.location.pathname,
        query: query
    }, {skipNull: true})

}
export default formUrlQuery