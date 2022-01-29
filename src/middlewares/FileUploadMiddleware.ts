import {Request, Response} from "express";
import multer from "multer";
import {MulterWordProcessingStorage} from "./MulterWordProccessingStorage";
import {Middleware, Next, Req, Res} from "@tsed/common";
import {Inject} from "@tsed/di";

@Middleware()
export class FileUploadMiddleware {
  @Inject()
  private customStorage: MulterWordProcessingStorage;
  private upload: any;

  async multerPromise(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      this.upload(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(req);
        }
      });
    });
  }

  async use(@Req() req: Req, @Res() res: Res, @Next() next: Next) {
    this.upload = multer({storage: this.customStorage}).single("inputfile");
    try {
      await this.multerPromise(req, res);
      next();
    } catch (err) {
      res.status(400).send({error: err.message});
    }
  }
}
