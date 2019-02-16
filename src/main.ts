#!/usr/bin/env node
import { DNSSynchronizer } from "./provision";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Configuration, DNSSync } from "./abstraction";
import { configurations } from "./globalization";
import { copy } from "@joejukan/web-kit";

let config: Configuration = JSON.parse(readFileSync(resolve('/etc/node/digital-ocean/config.json'), 'utf-8'));
copy(config, configurations);

let dns = configurations.dns;

if(dns){
    let options: DNSSync[] = [];
    if(Array.isArray(dns)){
        options = dns;
    }
    else {
        options.push(dns);
    }
    
    for(let i = 0; i < options.length; i++){
        setTimeout(() => {
            let opts = options[i];
            let sync = new DNSSynchronizer(opts);
            sync.checkIp().then(() => {}).catch(()=>{});
        }, i*5*1000)
    }
}