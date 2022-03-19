export type json = JSONObject;

interface JSONObject {
    [x: string]: json;
}

interface JSONArray extends Array<json> { }
