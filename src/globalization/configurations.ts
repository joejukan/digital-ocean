import { Configuration } from "../abstraction";
export let configurations: Configuration = <Configuration>{
    url: 'https://api.digitalocean.com/v2/',
    contentType: 'application/json',
    logging: {
        error: true,
        warn: true,
        info: true,
        debug: false,
        rotation: {
            filename: '/var/log/node/digital-ocean/application.log',
            audit_file: '/var/log/node/digital-ocean/audit.json',
            frequency: '1d',
            verbose: true,
            size: '10m',
            max_logs: '30d',
            date_format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }
    }
};