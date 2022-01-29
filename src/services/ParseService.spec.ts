import {PlatformTest} from "@tsed/common";
import {ParseService} from "./ParseService";

describe("ParseService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should count words", () => {
    const instance = PlatformTest.get<ParseService>(ParseService);

    const wordMap = instance.countWords("Lorem ipsum Lorem");

    expect(wordMap.get("Lorem")).toEqual(2);
    expect(wordMap.get("ipsum")).toEqual(1);
  });
});
