import { access } from "@joejukan/web-kit";
import { IFileStreamRotator, Rotation } from "../abstraction";
import { configurations } from "../globalization";
import * as file_stream_rotator from "file-stream-rotator";
import * as moment from "moment";
import { WriteStream } from "fs";


let FileStreamRotator:IFileStreamRotator = file_stream_rotator;
let stream: WriteStream;

function init(){
    if(!stream){
        let rotation:Rotation = access(configurations, 'logging.rotation')|| {};
        stream = FileStreamRotator.getStream(rotation);
    }
}

function p(prefix: string): string{
    let stamp = moment().format(access(configurations, 'rotation.date_format') || 'YYYY-MM-DD HH:mm:ss.SSS');
    let spaces = '';
    for(let i = prefix.length; i < 5; i++){
        spaces += ' ';
    }
    return `[${stamp}][${prefix}]${spaces}`;
}

function t(prefix: string, log: any){
    let stamp = moment().format(access(configurations, 'rotation.date_format') || 'YYYY-MM-DD HH:mm:ss.SSS');
    if(typeof log === 'object'){
        log = JSON.stringify(log);
    }
    return `[${stamp}]${p(prefix)} ${log}`;
}

function write(prefix: string, log: any){
    init();
    if(typeof log === 'object'){
        log = JSON.stringify(log);
    }
    stream.write(`${p(prefix)} ${log}\n`);
}

export function error(log: any){
    if(access(configurations, 'logging.error')){
        console.error(t( 'error', log ));
        write('error', log);
    }
}

export function warn(log: any){
    if(access(configurations, 'logging.warn')){
        console.warn(t( 'warn', log ));
        write('warn', log);
    }
}

export function info(log: any){
    if(access(configurations, 'logging.info')){
        console.info(t( 'info', log ));
        write('info', log);
    }
}

export function debug(log: any){
    if(access(configurations, 'logging.debug')){
        console.debug(t( 'debug', log ));
        write('debug', log);
    }
}