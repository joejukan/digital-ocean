import { Definable } from ".";
import { Define } from "../decoration";

@Define({ 
    url: 'https://api.ipify.org',
    headers: {}
})
export class IPRecord extends Definable{
    public ip: string;
}