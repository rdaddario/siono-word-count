import {Request} from "express";

export interface PostRequest extends Request {
  file: any;
}
