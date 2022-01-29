import {Controller} from "@tsed/di";
import {Post} from "@tsed/schema";
import {PostRequest} from "../models/PostRequest";
import {Req, UseBefore} from "@tsed/common";
import {FileUploadMiddleware} from "../middlewares/FileUploadMiddleware";

@Controller("/wordcount")
export class WorldCountController {
  @Post("/")
  @UseBefore(FileUploadMiddleware)
  count(@Req() request: PostRequest) {
    return request.file.wordProcessor.getTopNCount(3);
  }
}
