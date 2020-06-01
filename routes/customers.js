const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort("name");
    res.send(customers);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .send(`Could not find customer with ID ${req.params.id}`);
    }
    res.send(customer);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  // Validate the payload
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Create the customer in the database
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  try {
    const created = await customer.save();
    res.send(created);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.put("/:id", [auth, admin], async (req, res) => {
  // Validate the payload
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .send(`Could not find customer with ID ${req.params.id}`);
    }
    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer.isGold = req.body.isGold;
    const newCustomer = await customer.save();
    res.send(newCustomer);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) {
      return res
        .status(404)
        .send(`Could not find customer with ID ${req.params.id}`);
    }
    res.send(customer);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

module.exports = router;
