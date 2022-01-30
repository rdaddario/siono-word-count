import {PlatformTest} from "@tsed/common";
import {WordProcessor} from "../../services/WordProcessor";

describe("WordProcessor", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("Should count words", () => {
    const wordProcessor = PlatformTest.get<WordProcessor>(WordProcessor);

    const utf8Encode = new TextEncoder();
    const bytes = utf8Encode.encode("Lorem ipsum Lorem");

    wordProcessor.process(bytes);
    wordProcessor.flush();

    expect(wordProcessor.getWords().size).toEqual(2);
    expect(wordProcessor.getWords().get("Lorem")).toEqual(2);
    expect(wordProcessor.getWords().get("ipsum")).toEqual(1);
    expect(wordProcessor.isEOL).toBeFalsy();
  });

  it("Should process two consecutive sequences", () => {
    const wordProcessor = PlatformTest.get<WordProcessor>(WordProcessor);
    const utf8Encode = new TextEncoder();

    wordProcessor.process(utf8Encode.encode("Lorem ipsum Lor"));
    wordProcessor.process(utf8Encode.encode("em"));
    wordProcessor.flush();

    expect(wordProcessor.getWords().size).toEqual(2);
    expect(wordProcessor.getWords().get("Lorem")).toEqual(2);
    expect(wordProcessor.getWords().get("ipsum")).toEqual(1);
    expect(wordProcessor.isEOL).toBeFalsy();
  });

  it("Should process two consecutive sequences with line break and break word", () => {
    const wordProcessor = PlatformTest.get<WordProcessor>(WordProcessor);
    const utf8Encode = new TextEncoder();

    wordProcessor.process(utf8Encode.encode("Lorem ipsum Lor\n"));
    wordProcessor.process(utf8Encode.encode("em"));
    wordProcessor.flush();

    expect(wordProcessor.getWords().size).toEqual(2);
    expect(wordProcessor.getWords().get("Lorem")).toEqual(2);
    expect(wordProcessor.getWords().get("ipsum")).toEqual(1);
    expect(wordProcessor.isEOL).toBeFalsy();
  });

  it("Should process two consecutive sequences with line break", () => {
    const wordProcessor = PlatformTest.get<WordProcessor>(WordProcessor);
    const utf8Encode = new TextEncoder();

    wordProcessor.process(utf8Encode.encode("Lorem ipsum \n"));
    wordProcessor.process(utf8Encode.encode("Lorem"));
    wordProcessor.flush();

    expect(wordProcessor.getWords().size).toEqual(2);
    expect(wordProcessor.getWords().get("Lorem")).toEqual(2);
    expect(wordProcessor.getWords().get("ipsum")).toEqual(1);
    expect(wordProcessor.isEOL).toBeFalsy();
  });

  it("Should process line break", () => {
    const wordProcessor = PlatformTest.get<WordProcessor>(WordProcessor);
    const utf8Encode = new TextEncoder();

    wordProcessor.process(utf8Encode.encode("Lorem ipsum Lo\nrem"));
    wordProcessor.flush();

    expect(wordProcessor.getWords().size).toEqual(2);
    expect(wordProcessor.getWords().get("Lorem")).toEqual(2);
    expect(wordProcessor.getWords().get("ipsum")).toEqual(1);
    expect(wordProcessor.isEOL).toBeFalsy();
  });

  it("Should return top N", () => {
    const wordProcessor = PlatformTest.get<WordProcessor>(WordProcessor);
    const utf8Encode = new TextEncoder();

    wordProcessor.process(utf8Encode.encode("Lorem ipsum Lorem Lorem dolor ipsum"));
    wordProcessor.flush();

    let frequencies = wordProcessor.getTopNCount(1);
    expect(frequencies).toHaveLength(1);
    expect(frequencies[0].count).toEqual(3);

    frequencies = wordProcessor.getTopNCount(2);
    expect(frequencies).toHaveLength(2);
    expect(frequencies[0].count).toEqual(3);
    expect(frequencies[1].count).toEqual(2);

    frequencies = wordProcessor.getTopNCount(3);
    expect(frequencies).toHaveLength(3);
    expect(frequencies[0].count).toEqual(3);
    expect(frequencies[1].count).toEqual(2);
    expect(frequencies[2].count).toEqual(1);

    frequencies = wordProcessor.getTopNCount(4);
    expect(frequencies).toHaveLength(3);
    expect(frequencies[0].count).toEqual(3);
    expect(frequencies[1].count).toEqual(2);
    expect(frequencies[2].count).toEqual(1);
  });
});
