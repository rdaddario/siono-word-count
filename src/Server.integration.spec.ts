import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "./Server";

describe("Server", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("should call GET /rest", async () => {
    const response = await request.get("/rest").expect(404);

    expect(response.body).toEqual({
      errors: [],
      message: 'Resource "/rest" not found',
      name: "NOT_FOUND",
      status: 404
    });
  });

  describe("POST /rest/wordcount", () => {
    it("Should return the number of words", async () => {
      const smallSampleFilePath = "src/tests/fixtures/small.txt";

      const response = await request.post("/rest/wordcount/2").attach("inputfile", smallSampleFilePath).expect(200);

      const frequencies = JSON.parse(response.text);
      expect(frequencies).toHaveLength(2);

      let {count, word} = frequencies[0];
      expect(count).toEqual(1);
      expect(word).toEqual("Lorem");

      ({count, word} = frequencies[1]);
      expect(count).toEqual(1);
      expect(word).toEqual("ipsum");
    });

    it("Should return frequencies for medium sized file", async () => {
      const mediumSampleFilePath = "src/tests/fixtures/medium.txt";

      const response = await request.post("/rest/wordcount/3").attach("inputfile", mediumSampleFilePath).expect(200);

      const frequencies = JSON.parse(response.text);
      expect(frequencies).toHaveLength(3);

      let {count, word} = frequencies[0];
      expect(count).toEqual(15);
      expect(word).toEqual("Lorem");

      ({count, word} = frequencies[1]);
      expect(count).toEqual(15);
      expect(word).toEqual("ipsum");

      ({count, word} = frequencies[2]);
      expect(count).toEqual(15);
      expect(word).toEqual("dolor");
    });
  });
});
