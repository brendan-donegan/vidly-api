process.env.VIDLY_JWT_PRIVATE_KEY = "testit";
const config = require("config");

describe("config", () => {
  it("gets the value of VIDLY_JWT_PRIVATE_KEY if set", () => {
    const jwtPK = config.get("jwtPrivateKey");
    expect(jwtPK).toBe("testit");
  });
});
