import {Injectable} from "@tsed/di";

@Injectable()
export class ParseService {
  countWords(text: string) {
    return text.split(" ").reduce((wordMap, currentWord) => {
      const currentWordCount = wordMap.get(currentWord);
      wordMap.set(currentWord, currentWordCount ? currentWordCount + 1 : 1);

      return wordMap;
    }, new Map<string, number>());
  }
}
