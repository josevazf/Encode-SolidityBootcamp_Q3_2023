import styles from "./instructionsComponent.module.css";
import { useAccount, useNetwork } from "wagmi";

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>My App</h1>
        </div>
      </header>
      <p className={styles.get_started}>
        <PageBody></PageBody>
      </p>
    </div>
  );
}

function PageBody() {
	const a = Math.random();
	return (
		<div>
			<p>Testing static</p>
			<p>Testing dynamic: {a}</p>
		</div>
	)
}