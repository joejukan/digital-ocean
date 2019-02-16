import { DNSRecord } from "../definition";

export interface DNSSync {
    bearer?: string;
    delay?: number;
    interval?: number;
    records?: DNSRecord[]
}