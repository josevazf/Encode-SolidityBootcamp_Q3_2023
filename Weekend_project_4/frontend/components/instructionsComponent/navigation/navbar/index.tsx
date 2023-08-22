
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
        <p>Group 6</p>
      <ConnectKitButton />
    </nav>
  );
}
