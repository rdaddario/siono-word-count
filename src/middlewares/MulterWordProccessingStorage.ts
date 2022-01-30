import {Inject, Injectable} from "@tsed/di";
import {WordProcessorFactory} from "../services/WordProcessorFactory";
import concat from "concat-stream";
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

    file.stream.pipe(
      concat((data: any) => {
        $log.info(`Chunk size: ${data.length}`);
        wordProcessor.process(data);

        callback(null, {
          wordProcessor,
          size: data.length
        });
      })
    );

    file.stream.on("end", () => {
      wordProcessor.flush();
    });
  }

  public _removeFile(req: Express.Request, file: ExtendedFile, callback: (error: Error | null) => void): void {
    file.wordProcessor?.flush();
    callback(null);
  }
}
