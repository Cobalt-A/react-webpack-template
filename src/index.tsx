import React from "react";
import ReactDOM from "react-dom/client";
import './index.scss'

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    console.log(123);
    
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
