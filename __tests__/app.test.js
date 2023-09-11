const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const request = supertest(app);
const { MongoMemoryServer } = require("mongodb-memory-server");
const { redirect } = require("express/lib/response");

describe("POST /register", () => {
  describe("Given a valid username, valid e-mail address and valid password", () => {
    test("Should return a 302 status", async () => {
      const response = await request.post("/register").send({
        username: "cassiopeia2",
        email: "cassiopeia2@gmail.com",
        password: "cassiopeia",
      });
      expect(response.statusCode).toBe(302);
    });
  });

  describe("Given an invalid username, valid e-mail address and valid password", () => {
    test("Should return a 400 status", async () => {
      const response = await request.post("/register").send({
        username: "jest", // Fewer than 6 characters, so invalid
        email: "jestuser14@gmail.com",
        password: "jestuser14",
      });
      expect(response.statusCode).toBe(400);
    });
  });
});

describe("Given a valid username, valid e-mail address and invalid password", () => {
  test("SHould return a 400 status", async () => {
    const response = (await request.post("/register")).send({
      username: jestuser20,
      email: "jestuser20@gmail.com",
      password: "jest", // Fewer than 6 characters, so invalid
    });
    expect(response.send).toBe("");
  });
});
