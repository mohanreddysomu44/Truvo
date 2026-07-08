import { network } from "hardhat";

describe("Debug", function () {
  it("Check network", async function () {
    const connection = await network.connect();

    console.log(connection);
    console.log(connection.ethers);
  });
});