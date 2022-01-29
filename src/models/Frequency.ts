import {Property} from "@tsed/schema";

export class Frequency {
  @Property()
  word: string;

  @Property()
  count: number;

  constructor(options: Partial<Frequency>) {
    options.word && (this.word = options.word);
    options.count && (this.count = options.count);
  }
}
