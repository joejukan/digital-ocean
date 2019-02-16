import { Argumenter } from "@joejukan/argumenter";
import { AxiosError, AxiosResponse } from "axios";

export class Fault {
    public code: number;
    public message: string;
    public data: any;

    public constructor();
    public constructor(code: number);
    public constructor(message: string);
    public constructor(response: AxiosResponse);
    public constructor(err: AxiosError);
    public constructor(code: number, message: string);
    public constructor(message: string, code: number);
    public constructor(...args){
        let argue = new Argumenter(args);
        this.code = argue.number || 500;
        this.message = argue.string || 'Unknown';
        let ax = argue.object;

        if(ax){
            let err: AxiosError = <AxiosError> ax;
            let response: AxiosResponse = <AxiosResponse> ax;

            if(err.response){
                response = err.response;
            }

            if(response){
                this.code = response.status;
                this.message = response.statusText;
                this.data = response.data;
            }
        }
    }
}