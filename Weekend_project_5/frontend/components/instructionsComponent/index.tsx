import { useState, useEffect } from "react";
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork } from "wagmi";
import { ethers } from "ethers";
import * as tokenJson from '../assets/LotteryToken.json';
import * as lotteryJson from '../assets/Lottery.json';

const TOKEN_ADDRESS = '0x68ad4235Da8f94C80f359fdd31eB063DB6dD92a9';
const LOTTERY_ADDRESS = '0x9e000241a4Ddc82F4CEc47b35541950682b5d1bD';

export default function Loading() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true)
	}, [])

  return (
		mounted &&
			<div className={styles.container}>
				<header className={styles.header_container}>
					<div className={styles.header}>
						<h1>
						🤑 <span> Lottery</span> 🤑
						</h1>
						<h3>The ultimate web3 Lottery</h3>
					</div>
				</header>
					<p className={styles.get_started}>
						<PageBody></PageBody>
					</p>
			</div>
  );
}

function PageBody() {
	const {address, isConnecting, isDisconnected } = useAccount();
	if (address)
		return (
			<div>
				<WalletInfo></WalletInfo>
				<hr></hr>
				<LotteryInfo></LotteryInfo>
				<hr></hr>
				<TokenContract></TokenContract>
				<hr></hr>
				<LotteryContract></LotteryContract>			
			</div>
		);
		if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

////////\\\\\\\\     WALLET INFO   ////////\\\\\\\\

function WalletInfo() {
	const {address, isConnecting, isDisconnected } = useAccount();
	const { chain } = useNetwork();
	if (address)
    return (
      <div>
				<header className={styles.header_container}>
					<div className={styles.header}>
						<h3>Wallet Info</h3>
					</div>
				</header>
					<p>Connected to <i>{chain?.name}</i> network </p>
					{/* <WalletBalance address={address}></WalletBalance> */}
					<TokenName></TokenName>
					<WalletTokenBalance address={address}></WalletTokenBalance>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useContractRead({
    address: TOKEN_ADDRESS,
    abi: tokenJson.abi,
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div><b>Token: </b> {name} (<TokenSymbol></TokenSymbol>)</div>;
}

function TokenSymbol() {
  const { data, isError, isLoading } = useContractRead({
    address: TOKEN_ADDRESS,
    abi: tokenJson.abi,
    functionName: "symbol",
  });

  const symbol = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching symbol</div>;
  return <>{symbol}</>;
}

function WalletTokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
		token: TOKEN_ADDRESS,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div><b>Balance: </b>{data?.formatted} <TokenSymbol></TokenSymbol></div>;
}

////////\\\\\\\\   LOTTERY INFO   ////////\\\\\\\\

function LotteryInfo() {
	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.header}>
					<h3>Lottery Info</h3>
				</div>
			</header>
				<BetsState></BetsState>
		</div>
	);
}

function BetsState() {
	const { data, isError, isLoading } = useContractRead({
    address: LOTTERY_ADDRESS,
    abi: lotteryJson.abi,
    functionName: 'betsOpen',
  });

	const betsOpen = false ? "Closed" : "Open";

	if (isLoading) return <div>Checking bets state…</div>;
  if (isError) return <div>Error checking bets state</div>;
  return <div><b>Bets state:</b> {betsOpen}</div>;
}

// Apparently working but not passing data to frontend (not in use)
/* function BetsStateFromAPI () {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
	  fetch("http://localhost:3001/bets-state/")
		.then((res) => res.json())
		.then((data) => {
		  setData(data);
		  setLoading(false);
		});
	}, []);
  
	if (isLoading) return <p>Checking Lottery state from API...</p>;
	if (!data) return <p>Bets are :</p>;
	return (
	  <div>
		  <p>State: {data}</p>
	  </div>
	);
} */

////////\\\\\\\\   TOKEN CONTRACT   ////////\\\\\\\\

function TokenContract() {
	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.header}>
					<h3>Token Interaction</h3>
				</div>
			</header>
				<TokenBalanceFromAPI></TokenBalanceFromAPI>
				<br></br>
				<TransferTokens></TransferTokens>
				<br></br>
		</div>
	);
}

function TokenBalanceFromAPI () {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(false);
	const [address, setAddress] = useState("");

		return (
			<div>
				<input
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					placeholder="Address (0x...)"
				/>
				<br></br>
				<button
					disabled={isLoading}
					onClick={async() => {
						setLoading(true);
						fetch(`http://localhost:3001/get-token-balance/${address}`)
							.then((res) => res.json())
							.then((data) => {
								setData(data);
								setLoading(false);
						});
					}}
				>
					Get balance
				</button>
					{data !== null && <p>{data} G6TK</p>}
			</div>
		);
}

function TransferTokens() {
	const [addressTo, setAddress] = useState("");
	const [amount, setAmount] = useState("");
	const { data, isLoading, isSuccess, write } = useContractWrite({
    address: TOKEN_ADDRESS,
    abi: tokenJson.abi,
    functionName: 'transfer',
  })

		return (
			<div>
				<input
					value={addressTo}
					onChange={(e) => setAddress(e.target.value)}
					placeholder="Address (0x...)"
				/>
					<br></br>
						<input
							type='number'
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Amount"
						/>
				<br></br>
					<button
						disabled={!write}
						onClick={() =>write ({
							args: [addressTo, ethers.parseUnits(amount)],
						})
					}
					>
						Transfer Tokens
					</button>
					{isLoading && <div>Approve in wallet</div>}
					{isSuccess && <div> 
						<a target={"_blank"} href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
							Transaction details
      			</a></div>}
			</div>
		);
}
////////\\\\\\\\   LOTTERY CONTRACT   ////////\\\\\\\\

function LotteryContract() {
	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.header}>
					<h3>Lottery Interaction</h3>
				</div>
			</header>
				<BuyTokens></BuyTokens>
		</div>
	);
}

function BuyTokens() {
	const [addressTo, setAddress] = useState("");
	const [amount, setAmount] = useState("");
	const { data, isLoading, isSuccess, write } = useContractWrite({
    address: LOTTERY_ADDRESS,
    abi: lotteryJson.abi,
    functionName: 'purchaseTokens',
  })

		return (
			<div>
					<input
						type='number'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="Amount"
					/>
				<br></br>
					<button
						disabled={!write}
						onClick={() =>write ({
							value: ethers.parseUnits(String((Number(amount)*0.0001))) 
						})
					}
					>
						Swapping Tokens
					</button>
					{isLoading && <div>Approve in wallet</div>}
					{isSuccess && <div>
						<a target={"_blank"} href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
							Transaction details
      			</a></div>}
			</div>
		);
}