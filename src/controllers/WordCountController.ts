import {Controller} from "@tsed/di";
import {Post} from "@tsed/schema";
import {PostRequest} from "../models/PostRequest";
import {PathParams, Req, UseBefore} from "@tsed/common";
import {FileUploadMiddleware} from "../middlewares/FileUploadMiddleware";
import {BadRequest} from "@tsed/exceptions";

@Controller("/wordcount")
export class WorldCountController {
  @Post("/:top")
  @UseBefore(FileUploadMiddleware)
  count(@Req() request: PostRequest, @PathParams("top") top = 10) {
    if (!request.file) {
      throw new BadRequest("File is missing. Post the file as form data with name 'inputfile'");
    }

    return request.file.wordProcessor.getTopNCount(top);
  }
}
