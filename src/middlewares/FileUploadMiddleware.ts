import { NextFunction, Request, Response } from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("inputfile");

const multerPromise = (req: Request, res: Response) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err: any) => {
            if(err){
                reject(err);
            } else {
                resolve(req);
            }
        });
    });
}

export const fileUploadMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try{
        await multerPromise(req, res);
        next();
    } catch(err) {
        res.status(400).send({error: err.message})
    }
}
