const supertest = require("supertest");
const { Customer } = require("../../models/customer");

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
});
