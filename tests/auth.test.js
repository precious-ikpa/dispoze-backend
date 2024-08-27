const app = require("../bin/www");
const mongoose = require("mongoose");
const request = require("supertest");
const usersModel = require("../models/usersModel");
const userTokenModel = require("../models/userTokenModel");

beforeAll(async () => {
  await usersModel.deleteMany({});
  await userTokenModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

describe("This is to test all the auth endpoints", () => {
  test("Register", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "Kennedy112",
      lastName: "Ohia",
      email: "ken@gmail.com",
      phoneNumber: "09094474327",
      password: "kennedy@",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
  });

  
  test("Login", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "ken@gmail.com",
      password: "kennedy@",
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toBeTruthy();
    expect(response.body.access_token).toBeTruthy();
    expect(response.body.message).toBe("Login Successfully");
  });
  
});
