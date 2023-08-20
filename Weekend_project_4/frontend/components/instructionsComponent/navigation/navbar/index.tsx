
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-16#weekend-project" target={"_blank"}>
        <p>Solidity Bootcamp - Weekend Project 4</p>
      </a>
      <ConnectKitButton />
    </nav>
  );
}
