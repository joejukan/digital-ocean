import { properties } from '@joejukan/web-kit'
import { Argumenter } from '@joejukan/argumenter'

/**
 * @author Joseph Eniojukan
 * @description provides string templating capabilities
 * @param template the output pattern
 * @param {string|number|boolean|object} value the data used to populate the output pattern.
 */
export function format(template: string, value: string): string;
export function format(template: string, value: String): string;
export function format(template: string, value: number): string;
export function format(template: string, value: Number): string;
export function format(template: string, value: boolean): string;
export function format(template: string, value: Boolean): string;
export function format(template: string, value: Object): string;
export function format(...args){

    let argue = new Argumenter(args);
    let template = argue.string;
    
    let string = argue.string;
    let number = argue.number;
    let boolean = argue.boolean;
    let object = argue.object;
    let result = template || "";
    let array = argue.array;

    if(template){
        if(string)
            result = result.replace(/\{\s*\}/g, string);
        
        else if(number)
            result = result.replace(/\{\s*\}/g, number.toString());

        else if(boolean)
            result = result.replace(/\{\s*\}/g, boolean.toString());

        else if(object){
            
            let keys = properties(object);
            keys.forEach(key => {
                let value = object[key];
                let param = new RegExp('\{\s*' + key + '\s*\}', 'g');

                if(typeof value === 'undefined')
                    result = result.replace(param, '');

                else if(typeof value === 'string')
                    result = result.replace(param, value);

                else if(typeof value === 'number' || typeof value === 'boolean')
                    result = result.replace(param, value.toString());
            })
        }

    }

    return result;
}