import {Injectable} from "@tsed/di";
import * as Collections from "typescript-collections";
import {Frequency} from "../models/Frequency";
import {$log} from "@tsed/logger";

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
    return a.count - b.count;
  });
  private EOL = "\n".charCodeAt(0);
  private EMPTY = "";
  private allowedChars = /^\w+$/;
  private currentWord = "";

  public process(bytes: Uint8Array): void {
    $log.info(`Processing ${bytes.length} bytes...`);

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

    this.dictionary.forEach((value, key) => {
      this.addToNode(key, value);
    });

    $log.info(`Process complete!`);
  }

  public close() {
    this.btree.clear();
    this.dictionary.clear();
    this.currentWord = this.EMPTY;
  }

  public getWords() {
    return this.dictionary;
  }

  public getTopNCount(n: number) {
    const result: Frequency[] = [];

    // TODO: Do a reverse order traversal here; This library does not support it directly. Cannot access nodes directly for recursion.
    const orderedTree = this.btree.toArray();

    while (result.length < n && orderedTree.length) {
      const item = orderedTree.pop();
      if (item) {
        for (let i = 0; i < item.values.length && result.length < n; i++) {
          result.push(new Frequency({word: item.values[i], count: item.count}));
        }
      }
    }

    return result;
  }

  private addWord(word: string): void {
    if (word) {
      const currentWordCount = this.dictionary.get(word) || 0;
      this.dictionary.set(word, currentWordCount + 1);
    }
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
