import qs from "query-string";
interface Config {
    params?: Record<string, string | number>;
    hash?:string;
}


const formUrlQuery = (currentParams: string, config : Config = {} ) : string => {
    const query = qs.parse(currentParams);

    const {params} = config

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