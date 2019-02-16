import { DNSSync, Rotation } from ".";

export interface Configuration {
    url?: string;
    contentType?: string;
    logging?: {
        error?: boolean;
        warn?: boolean;
        info?: boolean;
        debug?: boolean;
        rotation?: Rotation;
    };
    dns?: DNSSync | DNSSync[]
}