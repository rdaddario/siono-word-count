import {Injectable} from "@tsed/di";
import {WordProcessor} from "./WordProcessor";

@Injectable()
export class WordProcessorFactory {
  public createInstance(): WordProcessor {
    return new WordProcessor();
  }
}
