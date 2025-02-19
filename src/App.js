import React, { useState } from 'react'

export default function App() {
  const[textToRead,settextToread]=useState()
  const HandleChangeInput=(e)=>{
    settextToread(e.target.value)
  }
  const Handlespeak=()=>{
    const utterence=new SpeechSynthesisUtterance(textToRead)
    window.speechSynthesis.speak(utterence)
  }
  return (
    <>
      <h1>Text To Speech</h1>
      <textarea 
      rows="4"
      cols="50"
      placeholder="Enter text to be spoken"
      value={textToRead}
      onChange={HandleChangeInput} 
      >

      </textarea><br></br>
      <button onClick={Handlespeak}>Speak</button>
    </>
  )
}
