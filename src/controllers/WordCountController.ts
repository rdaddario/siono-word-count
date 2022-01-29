import {Controller, Inject} from "@tsed/di";
import {Get, Post} from "@tsed/schema";
import {Frequency} from "../models/Frequency";
import {PostRequest} from "../models/PostRequest";
import {Req, Use} from "@tsed/common";
import {fileUploadMiddleware} from "../middlewares/FileUploadMiddleware";
import {WordProcessorFactory} from "../services/WordProcessorFactory";

@Controller("/wordcount")
export class WorldCountController {
  @Inject()
  private wordProcessorFactory: WordProcessorFactory;

  @Get("/")
  get() {
    const frequencies = [new Frequency({word: "first", count: 8})];

    return frequencies;
  }

  @Post("/")
  @Use(fileUploadMiddleware)
  count(@Req() request: PostRequest) {
    const wordProcessor = this.wordProcessorFactory.createInstance();
    wordProcessor.process(request.file.buffer);
    wordProcessor.flush();

    return wordProcessor.getTopNCount(3);
  }
}
