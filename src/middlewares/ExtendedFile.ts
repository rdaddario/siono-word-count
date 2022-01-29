import {WordProcessor} from "../services/WordProcessor";

export interface ExtendedFile extends Express.Multer.File {
  wordProcessor: WordProcessor;
}
