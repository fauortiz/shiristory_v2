import React from "react"

// import './TotalScore.css'

export default function TotalScore({score}) {
    return (
        <div id="total-score-area">
            💠<span id="total-score">{score}</span>
        </div>
    )
}