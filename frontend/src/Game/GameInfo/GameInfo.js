import React from "react"

import './GameInfo.css'

import Timer from "./Timer/Timer.js"
import TotalScore from "./TotalScore/TotalScore.js"
import TotalHelped from "./TotalHelped/TotalHelped.js"

export default function GameInfo({gameData, finishGame}) {
    return (
        <div className="game-info-area no-sel">
            <div className="game-numbers-section">
                <TotalScore score={gameData.score} />
                { !gameData.isFinished &&
                    <Timer finishGame={finishGame} baseTime={gameData.time} bonusTime={gameData.bonusTime} />
                }
                <TotalHelped helped={gameData.helped} />
            </div>
        </div>
    )
}