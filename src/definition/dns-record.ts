import { Definable, IPRecord } from "../definition";
import { Define } from "../decoration";
import { Argumenter } from "@joejukan/argumenter";
import { ok } from "@joejukan/web-kit";

@Define({
    object: { key: 'domain_record', uri: '/domains/{domain}/records/{id}' }, 
    list:{ key: 'domain_records', uri: '/domains/{domain}/records' }
})
export class DNSRecord extends Definable {
    public type: string;
    public name: string;
    public data: string;
    public ttl: number;
    public port: number = null;
    public weight: number = null;
    public flag: number = null;
    public tag: string = null;

    public constructor(){
        super();
        Object.defineProperty(this, '_domain', {enumerable: false, writable: true});
    }

    public get domain(): string{
        return this['_domain'];
    }

    public set domain(value:string){
        this['_domain'] = value;
    }

    public matches(record: DNSRecord): boolean;
    public matches(record: IPRecord): boolean;
    public matches(...args): boolean{
        let argue = new Argumenter(args);
        let ip = argue.instance(IPRecord);
        let dns = argue.instance(DNSRecord);

        if(ip){
            return ip.ip === this.data && ok(this.data);
        }

        else if(dns){
            return dns.name === this.name  && this.type == dns.type && ok(this.name) && ok(this.type);
        }

        return false;
    }
}