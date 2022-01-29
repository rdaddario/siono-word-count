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

      const response = await request.post("/rest/wordcount").attach("inputfile", smallSampleFilePath).expect(200);

      expect(response.text).toContain("Lorem ipsum...");
    });
  });
});
