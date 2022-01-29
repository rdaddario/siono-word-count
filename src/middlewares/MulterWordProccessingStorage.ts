import {Inject, Injectable} from "@tsed/di";
import {WordProcessorFactory} from "../services/WordProcessorFactory";
import concat from "concat-stream";
import multer from "multer";
import {ExtendedFile} from "./ExtendedFile";

@Injectable()
export class MulterWordProcessingStorage implements multer.StorageEngine {
  @Inject()
  private wordProcessorFactory: WordProcessorFactory;

  public _handleFile(req: Express.Request, file: ExtendedFile, callback: (error?: any, info?: Partial<ExtendedFile>) => void): void {
    const wordProcessor = this.wordProcessorFactory.createInstance();

    file.stream.pipe(
      concat((data: any) => {
        wordProcessor.process(data);

        callback(null, {
          wordProcessor,
          size: data.length
        });
      })
    );
  }

  public _removeFile(req: Express.Request, file: ExtendedFile, callback: (error: Error | null) => void): void {
    file.wordProcessor?.flush();
    callback(null);
  }
}
