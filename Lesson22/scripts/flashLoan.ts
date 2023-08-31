import "dotenv/config";
import {
  MyFlashMinter,
  MyFlashMinter__factory,
  MyFlashSwap,
  MyFlashSwap__factory,
  MagicSwapFaucet,
  MagicSwapFaucet__factory,
} from "../typechain-types";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const FLASH_LOAN_FEE = 1000;
const FLASH_LOAN_AMOUNT = 10;
const flashLoanFeeString = ((FLASH_LOAN_FEE * 100) / 10000).toFixed(2) + "%";

let flashMintErc20Contract: MyFlashMinter;
let flashSwapContract: MyFlashSwap;
let magicSwapFaucetContract: MagicSwapFaucet;

async function main() {
  const signers = await ethers.getSigners();
  const signer = signers[0];

  await initContracts(signer);
  await checkBalances(signer);
  await makeSwap();
  await checkBalances(signer);
}

async function initContracts(signer: HardhatEthersSigner) {
  const flashMintErc20ContractFactory = new MyFlashMinter__factory(signer);
  const signerAddress = await signer.getAddress();
  console.log("Deploying FlashMint ERC20 Contract\n");
  flashMintErc20Contract = await flashMintErc20ContractFactory.deploy(
    "Stonks Token",
    "Stt",
    signerAddress,
    FLASH_LOAN_FEE
  );
  console.log("Awaiting confirmations\n");
  await flashMintErc20Contract.waitForDeployment();
  const flashMintErc20ContractAddress =
    await flashMintErc20Contract.getAddress();
  console.log("Completed!\n");
  console.log(`Contract deployed at ${flashMintErc20ContractAddress}\n`);
  const flashSwapContractFactory = new MyFlashSwap__factory(signer);
  console.log("Deploying FlashSwap Contract\n");
  flashSwapContract = await flashSwapContractFactory.deploy(
    flashMintErc20ContractAddress
  );
  console.log("Awaiting confirmations\n");
  await flashSwapContract.waitForDeployment();
  const flashSwapContractAddress = await flashSwapContract.getAddress();
  console.log("Completed!\n");
  console.log(`Contract deployed at ${flashSwapContractAddress}\n`);
  const magicSwapFaucetContractFactory = new MagicSwapFaucet__factory(signer);
  console.log("Deploying Magic Swap Faucet Contract\n");
  magicSwapFaucetContract = await magicSwapFaucetContractFactory.deploy();
  console.log("Awaiting confirmations\n");
  await magicSwapFaucetContract.waitForDeployment();
  const magicSwapFaucetContractAddress =
    await magicSwapFaucetContract.getAddress();
  console.log("Completed!\n");
  console.log(`Contract deployed at ${magicSwapFaucetContractAddress}\n`);
  console.log(
    "Minting some tokens to the Magic Swap Faucet Contract at FlashMint ERC20 Contract\n"
  );
  const mintTokensTx = await flashMintErc20Contract.mint(
    magicSwapFaucetContractAddress,
    ethers.parseEther((FLASH_LOAN_AMOUNT * 100).toFixed(18))
  );
  console.log("Awaiting confirmations\n");
  await mintTokensTx.wait();
  console.log("Completed!\n");
}

async function checkBalances(signer: HardhatEthersSigner) {
  const signerAddress = await signer.getAddress();
  const SignerBalanceBN = await flashMintErc20Contract.balanceOf(
    signerAddress
  );
  const SignerBalance = ethers.formatEther(
    SignerBalanceBN
  );
  const totalSupplyBN = await flashMintErc20Contract.totalSupply();
  const flashSwapContractAddress = await flashSwapContract.getAddress();
  const swapContractBalanceBN = await flashMintErc20Contract.balanceOf(
    flashSwapContractAddress
  );
  const magicSwapFaucetContractAddress =
    await magicSwapFaucetContract.getAddress();
  const magicSwapFaucetContractBalanceBN =
    await flashMintErc20Contract.balanceOf(magicSwapFaucetContractAddress);
  const totalSupply = ethers.formatEther(totalSupplyBN);
  const swapContractBalance = ethers.formatEther(swapContractBalanceBN);
  const magicSwapFaucetContractBalance = ethers.formatEther(
    magicSwapFaucetContractBalanceBN
  );
  console.log(`Total supply of tokens: ${totalSupply}\n`);
  console.log(
    `Current token balance of the contract deployer: ${SignerBalance} Stt\n`
  );
  console.log(
    `Current token balance inside the swap contract: ${swapContractBalance} Stt\n`
  );
  console.log(
    `Current token balance inside the magic swap faucet contract: ${magicSwapFaucetContractBalance} Stt\n`
  );
}

async function makeSwap() {
  console.log(
    `Initiating flash swap to borrow ${FLASH_LOAN_AMOUNT} Stt trying to profit ${
      FLASH_LOAN_AMOUNT / 2
    } Stt\n`
  );
  const flashMintErc20ContractAddress =
    await flashMintErc20Contract.getAddress();
  const magicSwapFaucetContractAddress =
    await magicSwapFaucetContract.getAddress();
  const swapTx = await flashSwapContract.flashBorrow(
    flashMintErc20ContractAddress,
    ethers.parseEther(FLASH_LOAN_AMOUNT.toFixed(18)),
    magicSwapFaucetContractAddress,
    ethers.parseEther((FLASH_LOAN_AMOUNT / 2).toFixed(18))
  );
  console.log("Awaiting confirmations\n");
  const receipt = await swapTx.wait();
  const gasUsed = receipt?.gasUsed ?? 0n;
  const gasPrice = receipt?.gasPrice ?? 0n;
  console.log(
    `Flash Swap completed!\n\n${gasUsed} gas units spent (${ethers.formatEther(
      gasUsed * gasPrice
    )} ETH)\nPaid ${
      (FLASH_LOAN_AMOUNT * FLASH_LOAN_FEE) / 10000
    } Stt of lending fees (${flashLoanFeeString})\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
