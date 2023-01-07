import React from "react"

import "./Alien.css"

import alien0 from '../../static/images/alien0.png'
import alien1 from '../../static/images/alien1.png'
import alien2 from '../../static/images/alien2.png'
import alien3 from '../../static/images/alien3.png'
import alien4 from '../../static/images/alien4.png'

export default function Alien({isPlaying, currentAlien, prompt, musicLoaded, isCompact}) {

    function getAlienUrl(id) {
        switch(id) {
            case 4:
                return alien4
            case 3:
                return alien3
            case 2:
                return alien2
            case 1:
                return alien1
            default:
                return alien0
        }
    }

    return (
        <div className={`alien-area no-sel alien-area-zbounce-${isCompact ? "1" : "2"}`}>
            <div className={`alien-container ${isCompact ? "alien-container-compact" : ""}`}>
                <div className={`${currentAlien === -1 ? "alien-sizer" : ""}`}>
                    <div>{currentAlien === -1 && musicLoaded === null ? "loading..." : ""}</div>
                </div>
                <img className={`alien ${currentAlien === 0 ? "active" : ""}`} src={getAlienUrl(0)} alt="Alien" />
                <img className={`alien ${currentAlien === 1 ? "active" : ""}`} src={getAlienUrl(1)} alt="Alien" />
                <img className={`alien ${currentAlien === 2 ? "active" : ""}`} src={getAlienUrl(2)} alt="Alien" />
                <img className={`alien ${currentAlien === 3 ? "active" : ""}`} src={getAlienUrl(3)} alt="Alien" />
                <img className={`alien ${currentAlien === 4 ? "active" : ""}`} src={getAlienUrl(4)} alt="Alien" />
            </div>
            {isPlaying &&
                <div className="prompt">
                    {prompt.leftText}<span>{prompt.highlightText}</span>{prompt.rightText}
                </div>
            }
        </div>
    )
}