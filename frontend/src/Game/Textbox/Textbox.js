import { useState } from "react"

import "./Textbox.css"

export default function Textbox({isPlaying, evaluateWord, startGame, playSFXKeypress, isCompact, musicLoaded, playHum, stopHum, playSFXValid, isFinished, exitGame}) {
    
    // .text, .placeholder, sfxKeypress
    
    const [textData, setTextData] = useState({
        text: "",
        placeholder: "🔮",
        wordScore: null,
        promptScore: null,
        powerUsed: null
    })

    if (textData.text === "") {
        stopHum()
    } else if (!isPlaying && textData.text.length === 1) {
        // resets the hum even on backspacing, but it's barely noticable
        playHum()
    }
    if (isFinished && (textData.text !== "" || textData.placeholder !== "🔮")) {
        setTextData(prev => ({ ...prev,
            text: "",
            placeholder: "🔮"
        }))
    }

    function textOnChange(event) {
        playSFXKeypress()

        setTextData(prevTextData => ({
            ...prevTextData,
            text: event.target.value,
            wordScore: null,
            promptScore: null,
            powerUsed: null
        }))
    }

    function textOnSubmit(event) {
        event.preventDefault()
        if (!textData.text) return false

        if (!isPlaying) {
            playSFXValid()
            setTextData(prevTextData => ({
                ...prevTextData,
                text: "",
                placeholder: "🔮"
            }))
            return startGame()
        }
        if (textData.text === "...") {
            setTextData(prevTextData => ({
                ...prevTextData,
                text: "",
                placeholder: "🔮"
            }))
            return exitGame()
        }

        const scores = evaluateWord(textData.text.toLowerCase(), textData.placeholder)
        if (scores !== false) {

            setTextData(prevTextData => ({
                ...prevTextData,
                text: "",
                placeholder: scores.powerUsed === "wildcard" ? "🔮" : prevTextData.text.slice(-1).toLowerCase(),
                wordScore: scores.wordScore,
                promptScore: scores.promptScore,
                powerUsed: scores.powerUsed
            }))
        } else {
            setTextData(prevTextData => ({
                ...prevTextData,
                text: ""
            }))
        }
    }

    // console.log('render Textbox')
    return (
        <div className={`textbox-area ${musicLoaded ? 'textbox-popper' : ''}`}>
            <form className="textbox-form" onSubmit={textOnSubmit}>
                <input
                    type="text"
                    // id="textbox"
                    // name="textbox"
                    className={!isPlaying && textData.text.length > 0 ?  "textbox-shaker" : ""}
                    placeholder={textData.placeholder}
                    value={textData.text}
                    onChange={textOnChange}
                    autoComplete="off"
                    autoFocus={false}
                    spellCheck="false"
                    disabled={musicLoaded && !isFinished ? false : true}
                />
            </form>
            <div className={`word-score ${textData.wordScore !== null ? 'score-animate': ''} ${textData.text.length === 0 || !isPlaying ? 'score-hide' : ''} ${textData.powerUsed ? 'score-power' : ''}`}>
                {textData.wordScore ? `+${textData.wordScore}` : textData.text.length}
            </div>
            <div className={`prompt-score ${textData.promptScore ? 'score-animate': ''} ${isCompact ? 'prompt-compact': ''}`}>
                {`+${textData.promptScore}`}
            </div>
        </div>
    )
}