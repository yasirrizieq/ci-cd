const request = require("supertest");
const app = require("../app.js");
const truncate = require("../utils/truncate.js");

truncate.user();

const user = {
  name: "sabrina",
  email: "sabrina@mail.com",
  password: "password123",
  token: "",
};

describe("user.register function", () => {
  // Positif Case
  test("Mendaftarkan user dengan email yang belum terdaftar", async () => {
    try {
      const res = await request(app).post("/auth/register").send({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("user created!");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("email");
      expect(res.body.data).toHaveProperty("name");
    } catch (error) {
      expect(error).toBe("error");
    }
  });

  // Negatif Case
  test("Mendaftarkan user dengan email yang sudah terdaftar", async () => {
    try {
      const res = await request(app).post("/auth/register").send({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("email already used!");
    } catch (error) {
      expect(error).toBe("error");
    }
  });
});

describe("user.login function", () => {
  // Positif Case
  test("Login dengan email dan password yang benar", async () => {
    try {
      const res = await request(app).post("/auth/login").send({
        email: user.email,
        password: user.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("login success!");
      expect(res.body.data).toHaveProperty("token");

      user.token = res.body.data.token;
    } catch (error) {
      expect(error).toBe("error");
    }
  });

  // Negatif Case
  test("Login dengan email dan password yang salah", async () => {
    try {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: user.email,
          password: `${user.password}45`,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("credential is not valid!");
    } catch (error) {
      expect(error).toBe("error");
    }
  });
});

describe("user.whoami function", () => {
  // Positif Case
  test("Akses dengan mengirimkan token didalam header", async () => {
    try {
      const res = await request(app)
        .get("/auth/whoami")
        .set("Token", user.token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data).toHaveProperty("name");
      expect(res.body.data).toHaveProperty("email");
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("fetch user success!");
    } catch (error) {
      expect(error).toBe("error");
    }
  });

  // Negatif Case
  test(" Akses dengan tidak mengirimkan token didalam header", async () => {
    try {
      const res = await request(app).get("/auth/whoami");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("status");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("data");
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("you're not authorized!");
    } catch (error) {
      expect(error).toBe("error");
    }
  });
});
