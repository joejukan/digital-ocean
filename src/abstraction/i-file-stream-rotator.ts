import { Rotation } from ".";
import { WriteStream } from "fs";

export interface IFileStreamRotator{
    getStream(rotation: Rotation): WriteStream;
}