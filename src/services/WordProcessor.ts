import {Injectable} from "@tsed/di";

@Injectable()
export class WordProcessor {
  public isEOL = false;
  private dictionary: Map<string, number> = new Map<string, number>();
  private EOL = "\n".charCodeAt(0);
  private EMPTY = "";
  private allowedChars = /^\w+$/;
  private currentWord = "";

  public process(bytes: Uint8Array): void {
    bytes.forEach((charCode) => {
      this.isEOL = charCode === this.EOL;

      if (!this.isEOL && charCode) {
        const char = String.fromCharCode(charCode);
        if (this.allowedChars.test(char)) {
          this.currentWord += char;
        } else {
          this.addWord(this.currentWord);
          this.currentWord = this.EMPTY;
        }
      }
    });
  }

  public flush() {
    if (this.currentWord) {
      this.addWord(this.currentWord);
      this.currentWord = this.EMPTY;
    }
  }

  public getWords() {
    return this.dictionary;
  }

  private addWord(word: string): void {
    const currentWordCount = this.dictionary.get(word);
    this.dictionary.set(word, currentWordCount ? currentWordCount + 1 : 1);
  }
}
