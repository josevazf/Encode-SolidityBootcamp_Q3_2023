import { expect } from "chai";
import { ethers } from "hardhat";
import * as contractJson from "../artifacts/contracts/AssemblyTest.sol/AssemblyTest.json";
import { AssemblyTest } from "../typechain-types";

function findDiff(str1: string, str2: string) {
  let diff = "";
  str2.split("").forEach(function (val: string, i: number) {
    if (val !== str1.charAt(i)) diff += val;
  });
  return diff;
}

describe("Testing Assembly operations", async () => {
  let testContract: AssemblyTest;

  beforeEach(async () => {
    // First of all: deploy the library
    const getCodeLibraryFactory = await ethers.getContractFactory("GetCode");
    const getCodeLibrary = await getCodeLibraryFactory.deploy();
    await getCodeLibrary.waitForDeployment();
    const getCodeLibraryAddress = await getCodeLibrary.getAddress();

    // Secondly: get a contract factory, passing the library address
    const testContractFactory = await ethers.getContractFactory(
      "AssemblyTest",
      { libraries: { GetCode: getCodeLibraryAddress } }
    );
    testContract = await testContractFactory.deploy();
    await testContract.waitForDeployment();
  });

  it("Returns the correct code", async () => {
    const bytecode = await testContract.getThisCode();
    const diff = findDiff(bytecode, contractJson.deployedBytecode);
    const cleanedDiff = diff.replace(/__(?<=__)(.*?)(?=__)__/g, "");
    expect(cleanedDiff).to.eq("");
  });
});
