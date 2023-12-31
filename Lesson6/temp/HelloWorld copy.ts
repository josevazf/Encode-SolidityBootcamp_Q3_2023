/* import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloWorld", function () {
	it ("Should give a Hello World", async function () { // since we await the next function we need to do async
		const helloWorldFactory = await ethers.getContractFactory("HelloWorld"); //gets contract factory object, since it returns a promise we have to await 
		const helloWorldContract = await helloWorldFactory.deploy();
		await helloWorldContract.waitForDeployment(); // properly wait for deployment, can be risky not to wait
		const text = await helloWorldContract.helloWorld();
		expect(text).to.eq("Hello World!");
	})

	it("Should set owner to deployer account", async function () {
		const helloWorldFactory = await ethers.getContractFactory("HelloWorld"); //gets contract factory object, since it returns a promise we have to await 
		const helloWorldContract = await helloWorldFactory.deploy();
		await helloWorldContract.waitForDeployment(); // properly wait for deployment, can be risky not to wait
		const owner = await helloWorldContract.owner();
		const accounts = await ethers.getSigners();
		expect(owner).to.eq(accounts[0].address);
	})
}) */

import { expect } from "chai";
import { ethers } from "hardhat";
// https://github.com/dethcrypto/TypeChain
import { HelloWorld } from "../typechain-types";

/*	https://hardhat.org/hardhat-network-helpers/docs/overview 
This package provides convenience functions for quick and easy interaction with Hardhat Network. 
Facilities include the ability to mine blocks up to a certain timestamp or block number, 
the ability to manipulate attributes of accounts (balance, code, nonce, storage), 
the ability to impersonate specific accounts, and the ability to take and restore snapshots. */
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// https://mochajs.org/#getting-started
describe("HelloWorld!", function () {

  // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
  async function deployContract() {
  
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const accounts = await ethers.getSigners();
  
    // https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html#helpers
    const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // https://docs.ethers.org/v6/api/contract/#ContractFactory
    const helloWorldContract = await helloWorldFactory.deploy();
    // https://docs.ethers.org/v6/api/contract/#BaseContract-waitForDeployment
    await helloWorldContract.waitForDeployment();
  
    return {helloWorldContract, accounts};
  }

  it("Should give a Hello World", async function () {
    // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
    const { helloWorldContract } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    const helloWorldText = await helloWorldContract.helloWorld();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(helloWorldText).to.equal("Hello World");
  });

  it("Should set owner to deployer account", async function () {
     // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
     const { helloWorldContract, accounts } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    const contractOwner = await helloWorldContract.owner();
    // https://www.chaijs.com/api/bdd/#method_equal
    expect(contractOwner).to.equal(accounts[0].address);
  });

  it("Should not allow anyone other than owner to call transferOwnership", async function () {
    // https://hardhat.org/hardhat-network-helpers/docs/reference#fixtures
    const { helloWorldContract, accounts } = await loadFixture(deployContract);
  
    // https://docs.ethers.org/v6/api/contract/#BaseContract-connect
    // https://docs.ethers.org/v6/api/contract/#BaseContractMethod
    // https://hardhat.org/hardhat-chai-matchers/docs/overview#reverts
    await expect(
      helloWorldContract
        .connect(accounts[1])
        .transferOwnership(accounts[1].address)
    ).to.be.revertedWith("Caller is not the owner");
  });

  it("Should execute transferOwnership correctly", async function () {
    // TODO
    throw Error("Not implemented");
  });

  it("Should not allow anyone other than owner to change text", async function () {
    // TODO
    throw Error("Not implemented");
  });

  it("Should change text correctly", async function () {
    // TODO
    throw Error("Not implemented");
  });
});