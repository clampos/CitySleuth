const app = require("../app.js");
const supertest = require("supertest");
const request = supertest(app);

describe("POST /register", () => {
  describe("Given a valid username, valid e-mail address and valid password", () => {
    test("Should return a 200 status", async () => {
      const response = await request.post("/register").send({
        username: "jestuser10",
        email: "jestuser10@gmail.com",
        password: "jestuser10",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});
