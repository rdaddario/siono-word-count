import {Inject, Injectable} from "@tsed/di";
import {WordProcessorFactory} from "../services/WordProcessorFactory";
import multer from "multer";
import {ExtendedFile} from "./ExtendedFile";
import {$log} from "@tsed/logger";

@Injectable()
export class MulterWordProcessingStorage implements multer.StorageEngine {
  @Inject()
  private wordProcessorFactory: WordProcessorFactory;

  public _handleFile(req: Express.Request, file: ExtendedFile, callback: (error?: any, info?: Partial<ExtendedFile>) => void): void {
    $log.info(`Processing file ${file.originalname}`);
    const wordProcessor = this.wordProcessorFactory.createInstance();

    file.stream.on("data", (data) => {
      $log.info(`Chunk size: ${data.length}`);
      wordProcessor.process(data);
    });

    file.stream.on("end", () => {
      wordProcessor.flush();

      callback(null, {
        wordProcessor
      });
    });
  }

  public _removeFile(req: Express.Request, file: ExtendedFile, callback: (error: Error | null) => void): void {
    file.wordProcessor?.flush();
    callback(null);
  }
}
