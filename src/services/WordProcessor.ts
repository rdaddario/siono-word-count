import {Injectable} from "@tsed/di";
import * as Collections from "typescript-collections";
import {Frequency} from "../models/Frequency";

class TreeItem {
  count: number;
  values: string[];

  constructor(count: number, values: string[] = []) {
    this.count = count;
    this.values = values;
  }

  add(word: string) {
    this.values.push(word);
  }

  remove(word: string) {
    this.values = this.values.filter((w) => w !== word);
  }
}

@Injectable()
export class WordProcessor {
  public isEOL = false;
  private dictionary: Map<string, number> = new Map<string, number>();
  private btree: Collections.BSTree<TreeItem> = new Collections.BSTree<TreeItem>((a, b) => {
    return b.count - a.count;
  });
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

  public getTopNCount(n: number) {
    const result: Frequency[] = [];
    this.btree.inorderTraversal((item) => {
      item.values.forEach((word) => {
        if (result.length < n) {
          result.push(new Frequency({word, count: item.count}));
        }
      });

      if (result.length === n) {
        return false;
      }
    });

    return result;
  }

  private addWord(word: string): void {
    const currentWordCount = this.dictionary.get(word) || 0;
    this.dictionary.set(word, currentWordCount + 1);

    this.removeFromNode(word, currentWordCount);
    this.addToNode(word, currentWordCount + 1);
  }

  private addToNode(word: string, wordCount: number) {
    const treeItem = new TreeItem(wordCount);
    const currenNode = this.btree.search(treeItem);
    if (!currenNode) {
      treeItem.add(word);
      this.btree.add(treeItem);
    } else {
      currenNode.add(word);
    }
  }

  private removeFromNode(word: string, wordCount: number) {
    const treeItem = new TreeItem(wordCount);
    const currenNode = this.btree.search(treeItem);
    currenNode?.remove(word);
  }
}
