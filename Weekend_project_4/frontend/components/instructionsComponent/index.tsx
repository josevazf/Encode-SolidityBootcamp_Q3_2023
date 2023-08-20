import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, useSignMessage} from "wagmi";
import * as tokenJson from '../assets/G6Token.json';

const TOKEN_ADDRESS = '0x9805944Da4F69978dffc4c02eA924911D668d81a';
const BALLOT_ADDRESS = '0x86194b8C24DB66Ef9ACFA70b4c2fc837F0684961';

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>Tokenized Ballot dApp</h1>
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
				<br></br>
				<RequestTokensToBeMinted address={address}></RequestTokensToBeMinted>
				<br></br>
				<br></br>
				<TokenBalanceFromAPI></TokenBalanceFromAPI>
				<br></br>
				<VotesFromAPI></VotesFromAPI>
				<br></br>
				<TransferTokens></TransferTokens>
				<br></br>
				<DelegateVotes></DelegateVotes>
				<br></br>
				<Vote></Vote>
				<br></br>
				<WinnerFromAPI></WinnerFromAPI>
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

function WalletInfo() {
	const {address, isConnecting, isDisconnected } = useAccount();
	const { chain } = useNetwork();
	if (address)
    return (
      <div>
				<p>Connected to the {chain?.name} network </p>
				<WalletBalance address={address}></WalletBalance>
				<TokenName></TokenName>
				<WalletTokenBalance address={address}></WalletTokenBalance>
				<WalletVotes address={address}></WalletVotes>
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

/* function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("My input value");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div>
      <form>
        <label>
          Enter the message to be signed:
          <input
            type="text"
            value={signatureMessage}
            onChange={(e) => setSignatureMessage(e.target.value)}
          />
        </label>
      </form>
      <button
        disabled={isLoading}
        onClick={() =>
          signMessage({
            message: signatureMessage,
          })
        }
      >
        Sign message
      </button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
} */

function WalletBalance(params: { address: `0x${string}` }) { // (type_check)enforcing the starting of the string to 0x
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div>
      <p>Balance: {data?.formatted} {data?.symbol} ETH</p>
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
  return <div>Token name: {name}</div>;
}

function WalletTokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
		token: TOKEN_ADDRESS,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {data?.formatted} G6TK</div>;
}

function WalletVotes (params: { address: `0x${string}`}) {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(true);
  
	useEffect(() => {
	  fetch(`http://localhost:3001/get-token-balance/${params.address}`)
		.then((res) => res.json())
		.then((data) => {
		  setData(data);
		  setLoading(false);
		});
	}, []);
  
	if (isLoading) return <p>Loading token balance from API...</p>;
	if (!data) return <p>No answer from API</p>;
  
	return (
	  <div>
		  <p>Votes: {data}</p>
	  </div>
	);
}

function TokenBalanceFromAPI () {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(false);
	const [address, setAddress] = useState("");

	if (!data)
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
			</div>
		);

		return (
			<div>
			<p>Token balance: {data}</p>
			</div>
		);
}

function VotesFromAPI () {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(false);
	const [address, setAddress] = useState("");

	if (!data)
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
						fetch(`http://localhost:3001/get-votes/${address}`)
							.then((res) => res.json())
							.then((data) => {
								setData(data);
								setLoading(false);
						});
					}}
				>
					Get votes
				</button>
			</div>
		);

		return (
			<div>
			<p>Votes: {data}</p>
			</div>
		);
}

function RequestTokensToBeMinted(params: { address: `0x${string}`}) {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(false);

	if (isLoading) return <p>Requesting tokens from API...</p>;
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({address: params.address})
	}
	if (!data)  
		return (
			<button
        disabled={isLoading}
        onClick={() =>{
					setLoading(true);
					fetch("http://localhost:3001/mint-tokens", requestOptions)
						.then((res) => res.json())
						.then((data) => {
							setData(data);
							setLoading(false);
					});
			}}
      >
        Request Tokens
      </button>);
	return (
			<div>
				<p>Mint success: {data.success ? 'worked' : 'failed'}</p>
				<p>Transaction hash: {data.txHash}</p>
			</div>
	)
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
							args: [addressTo, ethers.utils.parseUnits(amount)],
						})
					}
					>
						Transfer tokens
					</button>
					{isLoading && <div>Check Wallet</div>}
					{isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
			</div>
		);
}

function DelegateVotes() {
	const [addressTo, setAddress] = useState("");
	const { data, isLoading, isSuccess, write } = useContractWrite({
    address: TOKEN_ADDRESS,
    abi: tokenJson.abi,
    functionName: 'delegate',
  })

		return (
			<div>
				<input
					value={addressTo}
					onChange={(e) => setAddress(e.target.value)}
					placeholder="Address (0x...)"
				/>
				<br></br>
					<button
						disabled={!write}
						onClick={() =>write ({
							args: [addressTo],
						})
					}
					>
						Delegate votes
					</button>
					{isLoading && <div>Check Wallet</div>}
					{isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
			</div>
		);
}

function Vote() {
	const [proposalNumber, setProposal] = useState("");
	const [amount, setAmount] = useState("");
	const { data, isLoading, isSuccess, write } = useContractWrite({
    address: BALLOT_ADDRESS,
    abi: tokenJson.abi,
    functionName: 'vote',
  })

		return (
			<div>
				<input
				type='number'
					value={proposalNumber}
					onChange={(e) => setProposal(e.target.value)}
					placeholder="Proposal (1, 2...))"
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
							args: [proposalNumber, ethers.utils.parseUnits(amount)],
						})
					}
					>
						Vote
					</button>
					{isLoading && <div>Check Wallet</div>}
					{isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
			</div>
		);
}

function WinnerFromAPI () {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(true);
  
	useEffect(() => {
	  fetch("http://localhost:3001/winner")
		.then((res) => res.json())
		.then((data) => {
		  setData(data);
		  setLoading(false);
		});
	}, []);
  
	if (isLoading) return <p>Loading winner from API...</p>;
	if (!data) return <p>No answer from API</p>;
  
	return (
	  <div>
		  <p>Winner: {data}</p>
	  </div>
	);
}
