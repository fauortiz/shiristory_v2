import React from "react"

import './VolumeSliders.css'

export default function VolumeSliders({gameData, changeVolume, previewSFX, volumeCollapse}) {

    function handleChangeSFX(event) {
        const volume = event.target.value
        changeVolume('sfxVolume', volume)
        previewSFX()
    }

    function handleChangeMusic(event) {
        const volume = event.target.value
        changeVolume('musicVolume', volume)
    }

    function renderSFXIcon() {
        if (gameData.sfxVolume === '0') return '🔈'
        if (gameData.sfxVolume === '10') return '🔊'
        return '🔉'
    }
    function renderMusicIcon() {
        if (gameData.musicVolume === '0') return '➖'
        if (gameData.musicVolume === '10') return '🎶'
        return '🎵'
    }

    return (
        <div className={`volume-area${volumeCollapse ? '' : ' show'}`}>
            <div className="volume-section sfx-volume-section">
                <div className="slider-icon">
                    {renderSFXIcon()}
                </div> 
                <input 
                    className="volume-slider"
                    type="range" 
                    min="0" 
                    max="10"
                    onChange={handleChangeSFX}
                    value={gameData.sfxVolume}
                />
            </div>
            <div className="volume-section music-volume-section">
                <div className="slider-icon">
                    {renderMusicIcon()}
                </div>
                <input 
                    className="volume-slider"
                    type="range" 
                    min="0" 
                    max="10"
                    onChange={handleChangeMusic}
                    value={gameData.musicVolume}
                />
            </div>
        </div>
    )
}