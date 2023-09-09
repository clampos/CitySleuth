const app = require("../app.js");
const supertest = require("supertest");
const mongoose = require("mongoose");
const request = supertest(app);
require("dotenv").config();

describe("POST /register", () => {
  describe("Given a valid username, valid e-mail address and valid password", () => {
    test("Should return a 302 status", async () => {
      const response = await request.post("/register").send({
        username: "jestuser30",
        email: "jestuser30@gmail.com",
        password: "jestuser12",
      });
      expect(response.statusCode).toBe(302);
      expect("Location").toBe("/login");
    });
  });

  describe("Given an invalid username, valid e-mail address and valid password", () => {
    test("Should return a 400 status", async () => {
      const response = await request.post("/register").send({
        username: "jest",
        email: "jestuser14@gmail.com",
        password: "jestuser14",
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
