import React from "react";
import ReactDOM from "react-dom/client";
import styles from './index.module.scss'


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const asd = 'werwetrytfghfghyr'

root.render(
  <React.StrictMode>
    <p className={styles.test}>{asd}dfgdfgdfg</p>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("SW registered: ", registration);
    })
    .catch((registrationError) => {
      console.log("SW registration failed: ", registrationError);
    });
  });
}
