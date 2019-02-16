import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError} from "axios";
import {Argumenter} from "@joejukan/argumenter"
import {singular, access, inject} from "@joejukan/web-kit";
import { endpoints, configurations } from "../globalization";
import { Definable } from "../definition";
import { Configuration, Endpoint } from "../abstraction";
import { debug, format } from  "../function";
import { Fault } from "../exception";

export class Service<D extends Definable> {
    private connection: AxiosInstance;
    private endpoint: Endpoint;
    private type: {new():D}

    constructor(type: {new(): D})
    constructor(type: {new(): D}, options: Configuration)
    constructor(...args){
        let argue = new Argumenter(args);
        let options: Configuration = argue.object || configurations
        this.type = argue.function;
        this.endpoint = endpoints[singular(this.type)];
        this.connection = axios.create({
            baseURL: this.endpoint.url || options.url || 'https://api.digitalocean.com/v2/',
            headers: this.endpoint.headers
        })
    }

    public create(): Promise<D>;
    public create(payload: D): Promise<D>;
    public create(payload: D, path: any): Promise<D>;
    public create(payload: D, path: any, parameters: any): Promise<D>;
    public create(payload: D, path: any, parameters: any, headers: any): Promise<D>;
    public create(...args): Promise<D> {
        return new Promise<D>( (accept: {(...args)} = () => {}, reject: {(...args)}= () => {}) => {
            let argue = new Argumenter(args);
            let payload = <D> argue.object;
            let path = argue.object;
            let params = argue.object;
            let headers = argue.object;

            let endpoint = this.endpoint;
            let connection = this.connection;
            let type = this.type;
            let key = access(endpoint, 'object.key');
            let uri = access(endpoint, 'object.uri');
            connection.put((uri ? format(uri, path) : '/'), payload, {params: params, headers: headers})
            .then( (response) => {
                let request: AxiosRequestConfig = response.config;
                let data = (key ? access(response.data, key) : response.data);
                debug(`[service-request] ${request.method} ${connection.defaults.baseURL}`);
                debug(`[service-request] ${request.data}`);
                debug(`[service-response] ${response.status} ${response.statusText}`);

                if(response.status === 200 || response.status === 201){
                    let result = Object.assign(new type(), data);
                    accept(result);
                }
                else{
                    reject(new Fault(response));
                }

            }).catch((err: AxiosError) => {
                console.log(err.stack);
                reject(new Fault(err));
            })
        })
    }

    public list(path: any, parameters?: any, headers?: any): Promise<Array<D>>{
        return new Promise<Array<D>>( (accept: {(...args)} = () => {}, reject: {(...args)}= () => {}) => {
            let endpoint = this.endpoint;
            let connection = this.connection;
            let key = access(endpoint, 'list.key');
            let uri = access(endpoint, 'list.uri');
            let type = this.type;
            let results = new Array<D>();
            
            connection.get((uri ? format(uri, path) : '/'), {params: parameters, headers: headers})
            .then( (response) => {
                let request: AxiosRequestConfig = response.request;
                let data = (key ? access(response.data, key) : response.data);
                debug(`[service-request] ${request.method} ${connection.defaults.baseURL}`);
                debug(`[service-response] ${response.status} ${response.statusText}`);
                if(response.status != 200){
                    reject(new Fault(response));
                }
                else if(Array.isArray(data)){
                    data.forEach( item => results.push(Object.assign(new type(), item)))
                    accept(results);
                }
                else{
                    results.push(Object.assign(new type(), data))
                    accept(results);
                }
            }).catch((err: AxiosError) => reject(new Fault(err)))
        } );
        
    }


}