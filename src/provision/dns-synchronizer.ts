import { DNSRecord, IPRecord } from "../definition";
import { Service } from "../communication";
import { error, info } from "../function";
import { Fault } from "../exception"
import { access, inject } from "@joejukan/web-kit";
import { DNSSync } from "../abstraction";
export class DNSSynchronizer {
    private pointer;
    
    public constructor(private options: DNSSync){
    }

    public start(){
        this.pointer = setInterval(() => this.checkIp(), (this.options.interval || 5) * 1000)
    }

    public stop(){
        clearInterval(this.pointer);
    }

    public sync(ipRecord: IPRecord): Promise<any>{
        let service = new Service(DNSRecord);
        let count: number = 0;
        let oos = new Array<DNSRecord>();
        let rsynced = 0;
        let dnsRecords: DNSRecord[] = access(this.options, 'records') || [];
        let headers = { Authorization: `Bearer ${this.options.bearer}`, 'Content-Type': 'application/json'}
        return new Promise<any>(( accept: {()} = () => {}, reject: {(err: any)} = () => {}) => {
            dnsRecords.forEach( dnsRecord => {
                dnsRecord = Object.assign(new DNSRecord(), dnsRecord);
                service.list(dnsRecord, {}, headers)
                .then(records => {
                    for(let i = 0; i < records.length; i++) {
                        let record = records[i];
                        if(dnsRecord.matches(record) && !record.matches(ipRecord)){
                            info(`[out-of-sync] ${dnsRecord.name}.${dnsRecord.domain} ${dnsRecord.type} ${record.data}`);
                            oos.push(record);
                        }
                    }

                    if(++count >= dnsRecords.length){
                        if(rsynced >= oos.length){
                            accept();
                        }
                        else{
                            oos.forEach( record => {
                                record.data = ipRecord.ip;
                                let path = Object.assign(new DNSRecord(), record);
                                path.domain = dnsRecord.domain;

                                service.create(record, path, {}, headers).then(() => {
                                    info(`[synced] ${record.name}.${dnsRecord.domain} ${record.type} ${record.data}`)
                                    if(++rsynced >= oos.length){
                                        accept();
                                    }
                                }).catch((err) => {
                                    error(err);
                                    if(++rsynced >= oos.length){
                                        reject(err);
                                    }
                                });
                            })
                            
                        }
                        
                    }
                })
                .catch( (fault: Fault) => {
                    error(fault);
                    if(++count >= dnsRecords.length && rsynced >= oos.length){
                        reject(fault);
                    }
                });
            });
        })
        
    }

    public checkIp(): Promise<IPRecord> {
        return new Promise<IPRecord> (
            (accept: {(r: IPRecord)}, reject: {(f: Fault)}) => {
                let service = new Service(IPRecord);
                service.list(new IPRecord(), {format: 'json'})
                .then( records => {
                    if(records.length > 0){
                        let record = records[0];
                        info(`[check-ip] ${access(record, 'ip')}`)
                        this.sync(record).then(() => accept(record)).catch( err => reject(err));
                    }
                    
                }).catch( (fault: Fault) => reject(fault));
            }
        );
        
    }
}