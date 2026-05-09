"use client"

import { UserInformationOnboard } from "./components/UserInformationOnboard/UserInformationOnboard";
import { Layout } from "./components/Layout/Layout";
import "./components/Layout/Layout.css"

export default function Home() {
  const btnOnClick = () => {
     console.log("Hello");
  }


  return (
    <Layout>
      <UserInformationOnboard>
      </UserInformationOnboard>
      <h1 className="title">GuessTheWordGame</h1>
      <div className="container">
        <button type="button" className="buttonStyling" id="playButtonPosition" onClick={btnOnClick}>Press Play</button>
        <button type="button" className="buttonStyling">Private Room</button>
        <input type="text" className="textFieldStyling" id="userNameId" placeholder="Enter your Username"></input>
      </div>
    </Layout>
  );
}
