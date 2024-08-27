const app = require("../bin/www");
const mongoose = require("mongoose");
const request = require("supertest");
const usersModel = require("../models/usersModel");


beforeAll(async () => {
//   await usersModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  app.close();
});

let userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzgzY2VlYWMyNTdhZGYyN2JlNzJlOSIsImVtYWlsIjoia2VuMTIzQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDQwMDYzMH0.OmAYbflm4SQFhDIRgY2DtdQKeetR2XHLVMHO-L6GvEc";

let userId;

describe("This is to test all the userProfile endpoints", () => {
  test("User Profile", async () => {
    const response = await request(app).get("/api/users")
    .set("Authorization", `Bearer ${userToken}`)

    userId = response.body._id;
    expect(response.status).toBe(200);

  });

  test("Edit Profile", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        address: "Ikorodu",
        jobTitle: "Banker",
      });

    expect(response.status).toBe(200);
  });
});
