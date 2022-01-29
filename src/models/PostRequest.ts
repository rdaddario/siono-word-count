import {Request} from "express";
import {ExtendedFile} from "../middlewares/ExtendedFile";

export interface PostRequest extends Request {
  file: ExtendedFile;
}
