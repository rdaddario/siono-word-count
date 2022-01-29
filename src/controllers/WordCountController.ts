import {Controller} from "@tsed/di";
import {Post} from "@tsed/schema";
import {PostRequest} from "../models/PostRequest";
import {PathParams, Req, UseBefore} from "@tsed/common";
import {FileUploadMiddleware} from "../middlewares/FileUploadMiddleware";

@Controller("/wordcount")
export class WorldCountController {
  @Post("/:top")
  @UseBefore(FileUploadMiddleware)
  count(@Req() request: PostRequest, @PathParams("top") top = 10) {
    return request.file.wordProcessor.getTopNCount(top);
  }
}
