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
    console.log(`Processing file ${file.originalname}`);

    file.stream.pipe(
      concat((data: any) => {
        console.log(`Chunk size: ${data.length}`);
        console.log(`Current word count: ${wordProcessor.getWords().size}`);
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
