const app = require("./app.js");
const supertest = require("supertest");
const request = supertest(app);

describe("POST /register", () => {
  describe("Given a valid username, valid e-mail address and valid password", () => {
    test("Should return a 200 status", async () => {
      const response = await request.post("/register").send({
        username: "jestuser",
        email: "jestuser@gmail.com",
        password: "jestuser",
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Given an invalid username, valid e-mail address and valid password", () => {
    test("Should return a 400 status", async () => {
      const response = await request.post("/register").send({
        username: "jest",
        email: "jestuser@gmail.com",
        password: "jestuser",
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
