const supertest = require("supertest");
const { Customer } = require("../../models/customer");
const { User } = require("../../models/user");

let server;

describe("/api/customers", () => {
  beforeEach(() => {
    server = require("../../server");
  });

  afterEach(async () => {
    await Customer.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all customers", async () => {
      await Customer.collection.insertMany([
        {
          name: "Brendan Donegan",
          phone: "080111222",
          isGold: true,
        },
        {
          name: "Luke Duke",
          phone: "010333777",
          isGold: false,
        },
      ]);
      const res = await supertest(server).get("/api/customers");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("should return the customer when it exists", async () => {
      const customer = new Customer({
        name: "Jeff Bridges",
        phone: "92310045",
        isGold: false,
      });
      await customer.save();
      const res = await supertest(server).get(`/api/customers/${customer._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: "Jeff Bridges",
        phone: "92310045",
        isGold: false,
      });
    });

    it("should return 404 if an invalid id was provided", async () => {
      const res = await supertest(server).get(`/api/customers/foobar`);
      expect(res.status).toBe(404);
      expect(res.text).toBe("Invalid ID.");
    });

    it("should return 404 if a valid but non-existent id is provided", async () => {
      const res = await supertest(server).get(
        `/api/customers/5eae94be025d711a205b3671`
      );
      expect(res.status).toBe(404);
      expect(res.text).toBe(
        "Could not find customer with ID 5eae94be025d711a205b3671"
      );
    });
  });

  describe("POST /", () => {
    async function createCustomer(
      payload,
      token = new User({ isAdmin: true }).generateAuthToken()
    ) {
      return supertest(server)
        .post("/api/customers")
        .set("x-auth-token", token)
        .send(payload);
    }

    it("creates a new customer if a valid payload is specified", async () => {
      const res = await createCustomer({
        name: "Brendan Donegan",
        phone: "00112233",
        isGold: false,
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: "Brendan Donegan",
      });
    });

    it("returns 400 is an invalid payload is specified", async () => {
      const res = await createCustomer({
        name: "Bren",
        phone: "00",
      });
      expect(res.status).toBe(400);
    });

    it("returns 401 if the no x-auth-token is provided", async () => {
      const res = await createCustomer(
        {
          name: "Brendan Donegan",
          phone: "0011223344",
        },
        ""
      );
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /:id", () => {
    async function updateCustomer(
      customerId,
      payload,
      token = new User({ isAdmin: true }).generateAuthToken()
    ) {
      return supertest(server)
        .put(`/api/customers/${customerId}`)
        .set("x-auth-token", token)
        .send(payload);
    }

    it("should update the customer if a valid payload is provided", async () => {
      const customer = new Customer({
        name: "Brendan Donegan",
        phone: "0011223344",
        isGold: true,
      });
      await customer.save();

      const res = await updateCustomer(customer._id, {
        name: "Nadnerb Nagenod",
        phone: "0011223344",
        isGold: false,
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        name: "Nadnerb Nagenod",
        phone: "0011223344",
        isGold: false,
      });
      const updatedCustomer = await Customer.findById(customer._id);
      expect(updatedCustomer).toMatchObject({
        name: "Nadnerb Nagenod",
        phone: "0011223344",
        isGold: false,
      });
    });

    it("should return 400 if an invalid payload is provided", async () => {
      const customer = new Customer({
        name: "Brendan Donegan",
        phone: "0011223344",
        isGold: true,
      });
      await customer.save();
      const res = await updateCustomer(customer._id, {
        name: "Bren",
        phone: "00",
      });
      expect(res.status).toBe(400);
    });

    it("should return 404 if a valid but non-existent id is provided", async () => {
      const res = await updateCustomer("5eae94be025d711a205b3671", {
        name: "Brendan Donegan",
        phone: "5544332211",
        isGold: false,
      });
      expect(res.status).toBe(404);
      expect(res.text).toBe(
        "Could not find customer with ID 5eae94be025d711a205b3671"
      );
    });
  });

  describe("DELETE /:id", () => {
    it("should delete the customer if it exists", async () => {
      const customer = new Customer({
        name: "Brendan Donegan",
        phone: "0011223344",
        isGold: false,
      });
      await customer.save();
      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await supertest(server)
        .delete(`/api/customers/${customer._id}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      const deletedCustomer = await Customer.findById(customer._id);
      expect(deletedCustomer).toBeNull();
    });

    it("should return 404 if the customer does not exist", async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await supertest(server)
        .delete(`/api/customers/5eae94be025d711a205b3671`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
      expect(res.text).toBe(
        "Could not find customer with ID 5eae94be025d711a205b3671"
      );
    });
  });
});
