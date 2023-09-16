const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const connection = require("../config/database");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const agent = request.agent(app);
const User = connection.models.User;

let server;

beforeAll(async () => {
  server = app.listen(0);
});

afterAll(async () => {
  server.close();
  await mongoose.disconnect();
});

describe("POST /register", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  test("Should register a new user with valid username, email address and password", async () => {
    const newUser = {
      username: "ursamajor",
      email: "ursamajor@gmail.com",
      password: "ursamajor",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(302); // Expecting a 302 status code indicating a successful redirect

    // Check that the response redirects to the login page
    expect(response.header.location).toBe("/login");
  });

  test("Should return an error for duplicate username", async () => {
    const existingUser = {
      username: "ursaminor",
      email: "ursaminor@gmail.com",
      password: "ursaminor",
    };

    await User.create(existingUser);

    const newUser = {
      username: "ursaminor", // Attempt to register with the same username
      email: "newursaminor@gmail.com",
      password: "ursaminor",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because a user already exists with this username

    // Confirming error message in response
    expect(response.body.message).toBe(
      "An account with the same username already exists. Please go back and try again."
    );

    // Confirm that no additional user has been added with the same e-mail address
    const matchingUsers = await User.find({
      username: newUser.username,
    });
    expect(matchingUsers.length).toBe(1);
  });

  test("Should return an error for duplicate email", async () => {
    const existingUser = {
      username: "andromeda",
      email: "andromeda@gmail.com",
      password: "andromeda",
    };

    await User.create(existingUser);

    const newUser = {
      username: "newandromeda",
      email: "andromeda@gmail.com", // Attempt to register with the same email
      password: "newandromeda",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because a user already exists with this email address

    // Confirming error message in response
    expect(response.body.message).toBe(
      "An account is already registered to this email address. Please go back and try again."
    );

    // Confirm that no additional user has been added with the same e-mail address
    const usersWithDuplicateEmail = await User.find({
      email: newUser.email,
    });
    expect(usersWithDuplicateEmail.length).toBe(1);
  });

  test("Should return an error for username shorter than 6 characters", async () => {
    const newUser = {
      username: "orion",
      email: "orion@gmail.com",
      password: "orionbelt",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because the username is less than 6 characters

    // Confirming error message in response
    expect(response.body.message).toContain(
      '"username" length must be at least 6 characters long'
    );
  });

  test("Should return an error for username longer than 20 characters", async () => {
    const newUser = {
      username: "andromedaandromedaand",
      email: "andromeda@gmail.com",
      password: "andromeda",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because the username is more than 20 characters

    // Confirming error message in response
    expect(response.body.message).toContain(
      '"username" length must be less than or equal to 20 characters long'
    );
  });

  test("Should return an error for email less than 6 characters", async () => {
    const newUser = {
      username: "cassiopeia",
      email: "c@me.c",
      password: "cassiopeia",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because the email is less than 7 characters

    // Confirming error message in response
    expect(response.body.message).toContain(
      '"email" length must be at least 7 characters long'
    );
  });

  test("Should return an error for email more than 40 characters", async () => {
    const newUser = {
      username: "cassiopeia",
      email: "cassiopeiacassiopeiacassiopeiac@gmail.com",
      password: "cassiopeia",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because the email is more than 40 characters

    // Confirming error message in response
    expect(response.body.message).toContain(
      '"email" length must be less than or equal to 40 characters long'
    );
  });

  test("Should return an error for password less than 6 characters", async () => {
    const newUser = {
      username: "cassiopeia",
      email: "cassiopeia@gmail.com",
      password: "cassi",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because the password is less than 6 characters

    // Confirming error message in response
    expect(response.body.message).toContain(
      '"password" length must be at least 6 characters long'
    );
  });

  test("Should return an error for password more than 20 characters", async () => {
    const newUser = {
      username: "cassiopeia",
      email: "cassiopeia@gmail.com",
      password: "cassiopeiacassiopeiac",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(400); // Expecting a 400 status code indicating a bad request because the password is more than 20 characters

    // Confirming error message in response
    expect(response.body.message).toContain(
      '"password" length must be less than or equal to 20 characters long'
    );
  });
});

describe("POST /login", () => {
  test("Should authenticate a user with valid username and password", async () => {
    const hashedPassword = await bcrypt.hash("centaurus", 10);
    await User.create({
      username: "centaurus",
      email: "centaurus@gmail.com",
      password: hashedPassword,
    });

    // 302 response status indicates redirect
    const response = await request(app)
      .post("/login")
      .send({ username: "centaurus", password: "centaurus" })
      .expect(302);

    // Confirm that the success-redirect is the homepage
    expect(response.header.location).toBe("/home");
  });

  test("Should return an error for non-existent username", async () => {
    const hashedPassword = await bcrypt.hash("centaurus", 10);
    await User.create({ username: "centaurus", password: hashedPassword });

    // 302 response status indicates redirect
    const response = await request(app)
      .post("/login")
      .send({ username: "notcentaurus", password: "centaurus" })
      .expect(302);

    // Confirm that the failure-redirect is the login-failure route (i.e. returning to the login page)
    expect(response.header.location).toBe("/login-failure");
  });

  test("Should return an error for incorrect password", async () => {
    const hashedPassword = await bcrypt.hash("centaurus", 10);
    await User.create({ username: "centaurus", password: hashedPassword });

    // 302 response status indicates redirect
    const response = await request(app)
      .post("/login")
      .send({ username: "centaurus", password: "notcentaurus" })
      .expect(302);

    // Confirm that the failure-redirect is the login-failure route (i.e. returning to the login page)
    expect(response.header.location).toBe("/login-failure");
  });
});

describe("GET /contact", () => {
  test("Should allow access when user is authenticated", async () => {
    const hashedPassword = await bcrypt.hash("sagittarius", 10);
    await User.create({
      username: "sagittarius",
      email: "sagittarius@gmail.com",
      password: hashedPassword,
    });

    const response = await agent
      .post("/login")
      .send({ username: "sagittarius", password: "sagittarius" });

    // Sending a GET request to /contact with an authenticated session
    const contactResponse = await agent.get("/contact").expect(200);
  });

  test("Should deny access when user is not authenticated", async () => {
    // Sending a GET request to /contact without an authenticated session
    const response = await request(app).get("/contact").expect(401);
    expect(response.text).toContain(
      "This is a protected route. Please go to the login page and sign in."
    );
  });
});

describe("GET /home", () => {
  test("Should allow access when user is authenticated", async () => {
    const hashedPassword = await bcrypt.hash("sagittarius", 10);
    await User.create({
      username: "sagittarius",
      email: "sagittarius@gmail.com",
      password: hashedPassword,
    });

    const response = await agent
      .post("/login")
      .send({ username: "sagittarius", password: "sagittarius" });

    // Sending a GET request to /home with an authenticated session
    const contactResponse = await agent.get("/home").expect(200);
  });

  test("Should deny access when user is not authenticated", async () => {
    // Sending a GET request to /home without an authenticated session
    const response = await request(app).get("/home").expect(401);
    expect(response.text).toContain(
      "This is a protected route. Please go to the login page and sign in."
    );
  });
});

describe("GET /dashboard", () => {
  test("Should allow access when user is authenticated", async () => {
    const hashedPassword = await bcrypt.hash("sagittarius", 10);
    await User.create({
      username: "sagittarius",
      email: "sagittarius@gmail.com",
      password: hashedPassword,
    });

    const response = await agent
      .post("/login")
      .send({ username: "sagittarius", password: "sagittarius" });

    // Sending a GET request to /dashboard with an authenticated session
    const contactResponse = await agent.get("/dashboard").expect(200);
  });

  test("Should deny access when user is not authenticated", async () => {
    // Sending a GET request to /dashboard without an authenticated session
    const response = await request(app).get("/dashboard").expect(401);
    expect(response.text).toContain(
      "This is a protected route. Please go to the login page and sign in."
    );
  });
});

describe("GET /my-account", () => {
  test("Should allow access when user is authenticated", async () => {
    const hashedPassword = await bcrypt.hash("sagittarius", 10);
    await User.create({
      username: "sagittarius",
      email: "sagittarius@gmail.com",
      password: hashedPassword,
    });

    const response = await agent
      .post("/login")
      .send({ username: "sagittarius", password: "sagittarius" });

    // Sending a GET request to /my-account with an authenticated session
    const contactResponse = await agent.get("/my-account").expect(200);
  });

  test("Should deny access when user is not authenticated", async () => {
    // Sending a GET request to /my-account without an authenticated session
    const response = await request(app).get("/my-account").expect(401);
    expect(response.text).toContain(
      "This is a protected route. Please go to the login page and sign in."
    );
  });
});
