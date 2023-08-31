import { ethers } from "ethers";
import "dotenv/config";
import { MyToken, MyToken__factory } from "../typechain-types";

const GAS_OPTIONS = {
  maxFeePerGas: 30 * 10 ** 9,
  maxPriorityFeePerGas: 30 * 10 ** 9,
};

function setupProvider() {
  const rpcUrl = process.env.CUSTOM_RPC_URL_MATIC;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return provider;
}

async function main() {
  // Set up wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Using address ${wallet.address}`);

  // Printing connection URL
  console.log(
    `Connected to the node at ${process.env.CUSTOM_RPC_URL_MATIC?.replace(
      /\w{25}$/,
      Array(25).fill("*").join("")
    )}`
  );

  // Set up a provider
  const provider = setupProvider();

  // Printing network info
  const network = await provider.getNetwork();
  console.log(`Network name: ${network.name}\nChain Id: ${network.chainId}`);
  const lastBlock = await provider.getBlock("latest");
  console.log(`Connected at height: ${lastBlock?.number}`);

  // Set up a signer
  const signer = wallet.connect(provider);
  const signerAddress = await signer.getAddress();

  // Printing wallet info
  const balanceBN = await provider.getBalance(signerAddress);
  const balance = Number(ethers.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough network tokens");
  }

  // Setting the fees
  const maxFeePerGasGwei = ethers.formatUnits(GAS_OPTIONS.maxFeePerGas, "gwei");
  const maxPriorityFeePerGasGwei = ethers.formatUnits(
    GAS_OPTIONS.maxPriorityFeePerGas,
    "gwei"
  );
  console.log(
    `Using ${maxFeePerGasGwei} maximum Gwei per gas unit and ${maxPriorityFeePerGasGwei} maximum Gwei of priority fee per gas unit`
  );

  // The next methods require network tokens to pay gas

  // Deploy a token
  console.log("Deploying Token contract");
  const tokenFactory = new MyToken__factory(signer);
  const tokenContract: MyToken = await tokenFactory.deploy(GAS_OPTIONS);
  console.log("Awaiting confirmations");
  await tokenContract.waitForDeployment();
  console.log("Completed");
  const contractAddress = await tokenContract.getAddress();
  console.log(`Contract deployed at ${contractAddress}`);

  // Minting 100 decimals of token
  const mintTx = await tokenContract.mint(wallet.address, 100, GAS_OPTIONS);
  await mintTx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
