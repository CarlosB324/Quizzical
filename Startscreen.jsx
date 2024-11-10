import React from "react"

export default function Startscreen(props) {
    
    return (
        <div className="start-screen-container">
            <h1 className="start-screen-title">Quizzical</h1>
            <h3 className="start-screen-subtitle">Test Your Might</h3>
            <button className="start-btn" onClick={props.startScreenClick}>Start Quiz</button>
        </div>
    )
}