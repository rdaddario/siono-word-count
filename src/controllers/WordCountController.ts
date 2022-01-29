import { Controller } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { Frequency } from "../models/Frequency";
import { PostRequest } from "../models/PostRequest";
import { Req, Use } from "@tsed/common";
import { fileUploadMiddleware } from "../middlewares/FileUploadMiddleware";

@Controller("/wordcount")
export class WorldCountController {
  @Get("/")
  get() {
    const frequencies = [new Frequency({ word: "first", count: 8 })];

    return frequencies;
  }

  @Post("/")
  @Use(fileUploadMiddleware)
  count(@Req() request: PostRequest) {
    return new Buffer(request.file.buffer).toString('utf8');
  }
}
