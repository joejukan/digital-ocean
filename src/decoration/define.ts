import { singular } from "@joejukan/web-kit";
import { Endpoint } from "../abstraction";
import { endpoints } from "../globalization";

export function Define(endpoint: Endpoint){
    return function (type: {new ()}){
        endpoints[singular(type)] = endpoint;
    }
}