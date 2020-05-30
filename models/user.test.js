const { validate } = require("./user");

describe("validate user", () => {
  it("is successful if the correct user information is provided", () => {
    const user = {
      name: "Luke Skywalker",
      email: "luke@rebellion.com",
      password: "usetheforce",
    };
    const { value } = validate(user);
    expect(value).toMatchObject(user);
  });

  it("fails if the password is not provided", () => {
    const user = {
      name: "Darth Vader",
      email: "vader@empire.com",
    };
    const { error } = validate(user);
    expect(error).toBeTruthy();
  });

  it("fails if the email address is not valid", () => {
    const user = {
      name: "Han Solo",
      email: "han",
      password: "nevertellmetheodds",
    };
    const { error } = validate(user);
    expect(error).toBeTruthy();
  });
});
