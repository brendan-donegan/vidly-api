const supertest = require("supertest");
const { User } = require("../../models/user");
const bcrypt = require("bcrypt");

let server;

describe("/api/auth", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    // clean up any test users that were created
    await User.deleteMany({});
  });
  describe("POST /", () => {
    it("returns a token if the login credentials are correct", async () => {
      const user = new User({
        name: "luke skywalker",
        email: "luke@rebels.com",
        password: "usetheforce",
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      const res = await supertest(server).post(`/api/auth`).send({
        email: "luke@rebels.com",
        password: "usetheforce",
      });
      expect(res.status).toBe(200);
      expect(res.body).not.toBeNull();
    });

    it("returns 400 if the username is not found", async () => {
      const user = new User({
        name: "luke skywalker",
        email: "luke@rebellion.com",
        password: "usetheforce",
      });
      const res = await supertest(server).post(`/api/auth`).send({
        email: "luke@rebel.com",
        password: "usetheforce",
      });
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password");
    });

    it("returns 400 if the wrong password is provided", async () => {
      const user = new User({
        name: "luke skywalker",
        email: "luke@rebellion.com",
        password: "usetheforce",
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();

      const res = await supertest(server).post(`/api/auth`).send({
        email: "luke@rebellion.com",
        password: "illneverjoinyou",
      });
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password");
    });

    it("returns 400 if the email address is in the wrong format", async () => {
      const res = await supertest(server).post(`/api/auth`).send({
        email: "luk.com",
        password: "illneverjoinyou",
      });
      expect(res.status).toBe(400);
    });
  });
});
