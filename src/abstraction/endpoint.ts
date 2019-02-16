export interface Endpoint{
    url?: string;
    headers?: {[key: string]: any};
    object?: {
        key?: string;
        uri?: string;
    },
    list?: {
        key?: string;
        uri?: string;
    }
}