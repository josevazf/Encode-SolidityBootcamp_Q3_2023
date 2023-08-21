import { useEffect, useState } from "react";
import { BytesLike, ethers, toNumber } from 'ethers';
import styles from "./instructionsComponent.module.css";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, useSignMessage} from "wagmi";
import * as tokenJson from '../assets/G6Token.json';
import * as ballotJson from '../assets/TokenizedBallot.json';
import { Uint } from "web3";

const TOKEN_ADDRESS = '0x9805944Da4F69978dffc4c02eA924911D668d81a';
const BALLOT_ADDRESS = '0x86194b8C24DB66Ef9ACFA70b4c2fc837F0684961';

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
					<img src="https://tomato-leading-stoat-542.mypinata.cloud/ipfs/QmPJwPc2cShgc96WxL2qTFeFDkaKr1adxr6ysRmXkDk8rQ"></img>
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
				<RequestTokensFromAPI address={address}></RequestTokensFromAPI>
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
				<p>Connected to <i>{chain?.name}</i> network </p>
				{/* <WalletBalance address={address}></WalletBalance> */}
				<TokenName></TokenName>
				<WalletTokenBalance address={address}></WalletTokenBalance>
				<WalletVotesFromAPI address={address}></WalletVotesFromAPI>
				<Winner></Winner>
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

// Get ETH balance (not used)
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
  return <div><b>Token: </b> {name}</div>;
}

function WalletTokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
		token: TOKEN_ADDRESS,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div><b>Balance: </b>{data?.formatted} G6TK</div>;
}

function WalletVotesFromAPI (params: { address: `0x${string}`}) {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(true);
  
	useEffect(() => {
	  fetch(`http://localhost:3001/get-votes/${params.address}`)
		.then((res) => res.json())
		.then((data) => {
		  setData(data);
		  setLoading(false);
		});
	}, []);
  
	if (isLoading) return <p>Loading token balance from API...</p>;
	if (!data) return <p>Votes:</p>;

	return (
	  <div>
		  <p><b>Votes: </b>{data}</p>
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

function RequestTokensFromAPI(params: { address: `0x${string}`}) {
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
        Request 100 Tokens
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
						Delegate Votes
					</button>

					{isLoading && <div>Approve in wallet</div>}
					{isSuccess && <div> 
						<a target={"_blank"} href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
							Transaction details
      			</a></div>}
			</div>
		);
}

function Vote() {
	const [proposalNumber, setProposal] = useState("");
	const [amount, setAmount] = useState("");
	const { data, isLoading, isSuccess, write } = useContractWrite({
    address: BALLOT_ADDRESS,
    abi: ballotJson.abi,
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
							value={amount as Uint}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Amount"
						/>
				<br></br>
					<button
						disabled={!write}
						onClick={() =>write ({
							args: [toNumber(proposalNumber), ethers.parseUnits(amount)],
						})
					}
					>
						Vote
					</button>
					{isLoading && <div>Approve in wallet</div>}
					{isSuccess && <div> 
						<a target={"_blank"} href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>
							Transaction details
      			</a></div>}
			</div>
		);
}

function Winner() {
	const { data, isError, isLoading } = useContractRead({
    address: BALLOT_ADDRESS,
    abi: ballotJson.abi,
    functionName: 'winnerName',
  });

  if (isLoading) return <div>Fetching winning proposal…</div>;
  if (isError) return <div>Error fetching winning proposal</div>;
  return <div><b>Winning proposal:</b> {ethers.decodeBytes32String(data as BytesLike)}</div>;
}

// Apparently working but not passing data to frontend
/* function WinnerFromAPI () {
	const [data, setData] = useState<any>(null);
	const [isLoading, setLoading] = useState(false);

	if (isLoading) return <p>Requesting info from API...</p>;
	if (!data)  
		return (
			<button
        disabled={isLoading}
        onClick={() =>{
					setLoading(true);
					fetch("http://localhost:3001/winner")
						.then((res) => res.json())
						.then((data) => {
							setData(data);
							setLoading(false);
					});
			}}
      >
        Winning Proposal
      </button>);
	return (
	  <div>
		  <p>Winner: {data}</p>
	  </div>
	);
} */
