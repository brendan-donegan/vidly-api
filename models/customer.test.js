const { validate } = require("./customer");

describe("validateCustomer", () => {
  it("validation succeeds with correct customer object", () => {
    const customer = {
      name: "brendan",
      phone: "000",
      isGold: true,
    };
    const { value } = validate(customer);
    expect(value).toMatchObject(customer);
  });

  it("validation succeeds when optional isGold is left out", () => {
    const customer = {
      name: "brendan",
      phone: "1111",
    };
    const { value } = validate(customer);
    expect(value).toMatchObject({
      name: "brendan",
      phone: "1111",
    });
  });

  it("validation fails when required name is left out", () => {
    const customer = {
      phone: "2222",
      isGold: false,
    };
    const { error } = validate(customer);
    expect(error).toBeTruthy();
  });
});
