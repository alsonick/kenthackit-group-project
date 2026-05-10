"use client"

import "./CreatePrivateRoomScreen.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const CreatePrivateRoomScreen = () => {
  const router = useRouter();
  const [timer, setTimer] = useState({t: 30}); 
  const [numOfPlayers, setNumOfPlayers] = useState(2);
  const [buttonText, setButtonText] = useState("Invite Link");
  const [rounds, setRounds] = useState(1);
  const [showStartButton, setShowStartButton] = useState(false);


  // function timerCountdown() {
  //   const interval = setInterval(() => {
  //     setTimer(p => {
  //       if (p.t <= 0) {
  //         clearInterval(interval);
  //         return p;
  //       }
  //       return {
  //         t: p.t - 1
  //       }
  //     });
  //   }, 1000);
  // }
  // useEffect(() => {
  //   timerCountdown()
  // }, []);

  return (
    <div className="create-private-room-screen">
    <div className="mainContent">
    <div className="innerContent">
      <label htmlFor="playersQuantity" className="stylingnumberfieldText">No of Players:</label>
       <input type="number" id="playersQuantity" name="playersQuantity" className="numberFieldStyling" min="2" max="10" value={numOfPlayers} onChange={e => {
        setNumOfPlayers(parseInt(e.target.value))
       }}></input>
       <label htmlFor="noOfRounds" className="noOfRoundstext">Rounds:</label>
       <input type="number" id="round" name="round" className="roundFieldStyling" min="1" max="10" value={rounds} onChange={e => setRounds(parseInt(e.target.value))}></input>
      <button type ="button" id="backButton" className="backGameButtonStyling" onClick={() => router.back()}>Back</button>
       <button type="button" id="invitelink" className="inviteButtonStyling" onClick={async () => {
        const roomId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const inviteLink = `${window.location.origin}/game-session?room=${roomId}`;
        setShowStartButton(true);
        
        try {
          await navigator.clipboard.writeText(inviteLink);
          setButtonText("Copied!");
          setTimeout(() => {
            setButtonText("Invite Link");
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
          setButtonText("Copy Failed");
          setTimeout(() => {
            setButtonText("Invite Link");
          }, 2000);
        }
      }}>{buttonText}</button>
      {showStartButton && (
        <button type="button" id="startgameButton" className="startGameButtonStyling" style={{ display: 'block' }}>Start Game</button>
      )}
      {/* <div className="circle">
        <p>{timer.t}</p>
  
      </div> */}
      
    </div>
    </div>
    </div>
  );
};
