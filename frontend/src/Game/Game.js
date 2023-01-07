import React, { useState, useEffect } from "react"
import {nanoid} from "nanoid"
import isEqual from "lodash/isEqual"
import useSound from 'use-sound'



import "./Game.css"

import sfxValid from '../static/audio/sfx_valid.mp3'
import sfxInvalid from '../static/audio/sfx_invalid.mp3'
import sfxKeypress from '../static/audio/sfx_keypress.mp3'
import sfxPower from '../static/audio/sfx_power.mp3'

import hum from '../static/audio/sfx_hum.mp3'
import music from '../static/audio/music_sharou_223am_2.mp3'

import Alien from "./Alien/Alien.js"
import Textbox from "./Textbox/Textbox.js"
import UsedWord from "./UsedWord/UsedWord.js"
import GameInfo from "./GameInfo/GameInfo.js"
import Combo from "./Combo/Combo.js"
import Tutorial from "./Tutorial/Tutorial.js"

import VolumeSliders from "./VolumeSliders/VolumeSliders.js"

export default function Game({ volumeCollapse, toggleVolume, tutorialCollapse, toggleTutorial, menuCollapse, toggleMenu }) {

    const [wordlist, setWordlist] = useState(() => JSON.parse(localStorage.getItem("wordlist")))
    const [gameData, setGameData] = useState({
        isPlaying: false, isFinished: false, isSaved: false,
        score: 0, helped: 0, time: 86, bonusTime: 0,
        // time is correct at 86 seconds, 'extender' bonusTime is +33 seconds
        alien: -1, lastColor: -1, lastSize: -1,
        infoText: 'say anything to begin',
        prompt: {}, wordCount: 0, promptScoreDisplay: null,

        comboCountdown: 50, 
        comboIsActive: false, multiplier: 1, combo: 0, bestCombo: 0, totalMultiplier: 0,
        // multipliers go from x1 to x2, x3, x4
        
        musicLoaded: null,

        // musicId: 0,
        sfxVolume: window.djangoProfile.sfxVolume, 
        musicVolume: window.djangoProfile.musicVolume, 
        isCompact: window.innerHeight <= 450 ? true : false,

        level: window.djangoProfile.level, 
        wildcardWords: window.djangoProfile.wildcards,
        extenderWord: window.djangoProfile.extender
    })
    const [usedWords, setUsedWords] = useState([])
    const [playSFXValid] = useSound(sfxValid, {volume: gameData.sfxVolume / 10, interrupt: true})
    const [playSFXInvalid] = useSound(sfxInvalid, {volume: gameData.sfxVolume  / 10, interrupt: true})
    const [playSFXKeypress] = useSound(sfxKeypress, {volume: gameData.sfxVolume / 10, interrupt: true})
    const [playSFXPower] = useSound(sfxPower, {volume: gameData.sfxVolume / 10, interrupt: true})
    const [playHum, { stop: stopHum }] = useSound(hum, {volume: gameData.musicVolume / 10, interrupt: true, loop: true})
    const [playMusic, { stop: stopMusic }] = useSound(music, {
        volume: gameData.musicVolume / 10, 
        interrupt: true, 
        onload: () => isMusicLoaded({music: true}),
        onloaderror: () => isMusicLoaded({music: false})
    })

    
    useEffect(() => {
        fetch(window.django.wordlistURL)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("wordlist", JSON.stringify(data))
            
            let localWordlist = JSON.parse(localStorage.getItem("wordlist"))
            if (!isEqual(wordlist, localWordlist)) {
                // console.log("Game: Effect: wordlists not equal, setWordlist")
                setWordlist(localWordlist)
            }
            // console.log('Game: Effect: wordlist verified')
        })
        .catch(() => {})//console.log('ERROR: Game: Effect: wordlist NOT verified')


        // pseudo-media query on viewport height, make game UI compact
        let manageIsCompact = () => {
            // gameData.isCompact is stale within this function, so it's easier to just unconditionally rerender
            if (window.innerHeight <= 450) {
                setGameData(prev => ({ ...prev,
                    isCompact: true
                }))
            } else {
                setGameData(prev => ({ ...prev,
                    isCompact: false
                }))
            } 
        }
        window.addEventListener('resize', manageIsCompact)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // run when volume slider is toggled and when isCompact is toggled
        if (window.django.isAuthenticated) {
            fetch(window.django.settingsURL, {
                method: 'PUT',
                body: JSON.stringify({
                    sfxVolume: gameData.sfxVolume,
                    musicVolume: gameData.musicVolume
                })
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volumeCollapse])

    useEffect(() => {
        if(gameData.isFinished) {
            if (window.django.isAuthenticated) {
                // console.log('POSTing game data')
                const words = serializeUsedWords(usedWords)

                fetch(window.django.gamesaveURL, {
                    method: 'POST',
                    body: JSON.stringify({
                        points: gameData.score,
                        helped: gameData.helped,
                        words: words,
                        max_combo: gameData.bestCombo,
                        ave_multiplier: Number.isNaN(gameData.totalMultiplier/usedWords.length) ? 1 : (gameData.totalMultiplier/usedWords.length).toFixed(4)
                    })
                }).then(response => {
                    if (response.status === 204) {
                        setGameData(prev => ({...prev,
                            isSaved: true
                        }))
                    }
                })

                function serializeUsedWords(words) {
                    const serializedWords = []
                    for (const word of words) {
                        serializedWords.push(word.word)
                    }
                    return serializedWords
                }
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameData.isFinished])

    function isMusicLoaded({music}) {
        if (music === true) {} //console.log('music loaded!')
        else if (music === false) {} //console.log('music failed to load...')
        else return false
        setGameData(prev => ({...prev,
            musicLoaded: music
        }))
        return true
    }

    function startGame() {
        playMusic()
        generateNewPrompt()
        pseudorandomizeAlien()
        setGameData(prevGameData => ({ ...prevGameData,
            isPlaying: true,
            infoText: ''
        }))
    }
    function finishGame() {
        stopMusic()
        setGameData(prev => ({ ...prev,
            isFinished: true
        }))
    }
    function exitGame() {
        stopMusic()
        setUsedWords([])
        setGameData(prevGameData => ({ ...prevGameData,
            isPlaying: false, isFinished: false, isSaved: false,
            score: 0, helped: 0, bonusTime: 0,
            alien: -1, lastColor: -1, lastSize: -1,
            infoText: 'say anything to begin',
            prompt: {}, wordCount: 0, promptScoreDisplay: null,
            comboIsActive: false, multiplier: 1, combo: 0, bestCombo: 0, totalMultiplier: 0
        }))
    }

    function evaluateWord(word, placeholder) {
        // word and placeholder are lowercase strings

        if (!isUnusedWord(word, usedWords)) {
            playSFXInvalid()
            updateInfoText(`"${word}" already used`)
            return false
        }
        if (!inWordlist(word, wordlist)) {
            playSFXInvalid()
            updateInfoText("invalid word")
            return false
        }
        // words from this point on are unused and on the wordlist

        // 'wildcard' power
        if (gameData.wildcardWords.includes(word)) {
            playSFXPower()
            const powerUsed = 'wildcard'
            updateInfoText(`"Refresh!"`)            
            appendUsedWord(word, powerUsed)
            return scoreWord(word, gameData.level, powerUsed)
        }

        if (!validFirstLetter(word, placeholder)) {
            playSFXInvalid()
            updateInfoText(`first letter should be "${placeholder}"`)
            return false
        }

        // 'extender' power
        if (word === gameData.extenderWord) {
            playSFXPower()
            const powerUsed = 'extender'
            updateInfoText(`"Attract!"`)
            setGameData(prevGameData => ({ ...prevGameData,
                bonusTime: prevGameData.bonusTime + 33
            }))
            appendUsedWord(word, powerUsed)
            return scoreWord(word, gameData.level, powerUsed)
        }

        // regular word scoring
        playSFXValid()
        const powerUsed = null
        updateInfoText('')
        appendUsedWord(word, powerUsed)
        return scoreWord(word, gameData.level, powerUsed)


        // every word valid for scoring passes through here!!!
        function scoreWord(word, level, powerUsed) {
            const [basePromptScore, baseHelpedScore] = evaluatePrompt(word)
            const [wordScore, promptScore, helpedScore] = updateScore(word, basePromptScore, baseHelpedScore, level, gameData.multiplier)

            // update combo gameData
            function refreshCombo() {
                // activate Combo component, if inactive
                // increment combo by 1 for next render
                setGameData(prev => ({...prev,
                    comboIsActive: true,
                    combo: prev.combo + 1,
                    bestCombo: prev.combo + 1 > prev.bestCombo ? prev.combo + 1 : prev.bestCombo
                }))
        
                // increment multiplier by 1, unless at max multipler of 4
                // and unless current render's combo is at 0
                // cuz the 1st word in a combo shouldn't add multiplier IMO
                // ...finally, add current multiplier to totalMultiplier
                if (gameData.multiplier !== 4) {
                    setGameData(prev => ({...prev,
                        multiplier: prev.multiplier + 1,
                        totalMultiplier: prev.totalMultiplier + prev.multiplier
                    }))
                } else {
                    setGameData(prev => ({...prev,
                        totalMultiplier: prev.totalMultiplier + prev.multiplier
                    }))
                }
            }
            refreshCombo()
            
            return {wordScore: wordScore, promptScore: promptScore, helpedScore: helpedScore, powerUsed: powerUsed}
        }

        function evaluatePrompt(word) {
            let promptScores = null

            // substring
            if (gameData.prompt.type === 'substring' && word.includes(gameData.prompt.condition)) {
                // substring prompt is valid
                promptScores = [gameData.prompt.points, 1]

            // wordCount
            } else if (gameData.prompt.type === 'wordCount') {
                if (gameData.wordCount + 1 === gameData.prompt.condition) {
                    // wordCount prompt is valid
                    promptScores = [gameData.prompt.points, 1]
                    setGameData(prevGameData => ({ ...prevGameData,
                        wordCount: 0
                    }))

                } else {
                    // wordCount prompt is in progress
                    setGameData(prevGameData => ({ ...prevGameData,
                        wordCount: prevGameData.wordCount + 1
                    }))
                }
            }

            if (promptScores === null) return [0, 0]

            generateNewPrompt()
            pseudorandomizeAlien()
            return promptScores
        }
        function updateScore(word, promptScore, helpedScore, level, multiplier) {
            const wordScore = word.length + word.length * ((level -1) + (multiplier - 1))
            promptScore = promptScore + promptScore * ((level -1) + (multiplier - 1))
            setGameData(prevGameData => ({ ...prevGameData,
                score: prevGameData.score + wordScore + promptScore,
                helped: prevGameData.helped + helpedScore
            }))
            return [wordScore, promptScore, helpedScore]
        }
        function validFirstLetter(word, placeholder) {
            // initial word is always valid
            return word.slice(0,1) === placeholder || placeholder === '🔮'
        }
        function inWordlist(word, wordlist) {
            const key = word.length.toString()
            const wordArray = wordlist[key]
            if (wordArray == null) return false
            // console.log(`from wordList[${key}], ${wordArray.length}, ${word}`)
            return binarySearch(word, wordArray, 0, wordArray.length - 1)
            
            function binarySearch(word, words, low, high) {
                if (low > high) return false
                const mid = Math.floor((low + high) / 2)
                const midWord = words[mid]
                if (word === midWord) return true
                else if (word < midWord) return binarySearch(word, words, low, mid - 1)
                else return binarySearch(word, words, mid + 1, high)
            }
        }
        function isUnusedWord(word, usedWords) {
            for (const usedWord of usedWords) {
                if (usedWord.word === word) {
                    // word is already in usedWord array
                    return false
                }
            }
            // word is unused, so it passes
            return true
        }
        function appendUsedWord(word, powerUsed) {
            const [color, size] = pseudorandomizeWordStyle(powerUsed)
            setUsedWords(prevUsedWords => [ ...prevUsedWords,
                {
                    id: nanoid(),
                    word: word,
                    className: `word word-color-${color} word-size-${size}`
                }
            ])
            function pseudorandomizeWordStyle(powerUsed) {
                // pick random styling, but guarantee no consecutive styling
                let color, size
                // special color if powerUsed
                if (powerUsed) {
                    color = 10
                } else {
                    do {
                        color = Math.floor(Math.random() * 3)
                    } while (color === gameData.lastColor)
                }
                do {
                    size = Math.floor(Math.random() * 4)
                } while (size === gameData.lastSize)
                setGameData(prevGameData => ({ ...prevGameData,
                        lastColor: color, 
                        lastSize: size
                }))
                return [color, size]
            }
        }
    }
    function generateNewPrompt() {
        let type, condition, leftText, highlightText, rightText, points
        if (Math.random() < 0.75) {
            type = 'substring' 
        } else {
            type = 'wordCount'
        }
        [type, condition, leftText, highlightText, rightText, points] = generatePrompt(type)
        setGameData(prevGameData => ({ ...prevGameData,
            prompt: {
                type: type,
                condition: condition,
                leftText: leftText,
                highlightText: highlightText,
                rightText: rightText,
                points: points
            },
            wordCount: 0
        }))
        return

        function generatePrompt(type) {
            if (type === 'substring') {
                // excluded J, Z, Q, X
                const substrings = 'abcdefghiklmnoprstuvwy'.split('')
                const substring = substrings[Math.floor(Math.random()*substrings.length)]
                const points = 6
                return [type, substring, 'A word with the letter ', substring, '!', points]
            }
            if (type === 'wordCount') {
                let count, points
                const roll = Math.random()
                if (roll < 0.4) [count, points] = [2, 8]
                else if (roll < 0.7) [count, points] = [1, 4]
                // else if (roll < 0.9) [count, points] = [4, 16]
                // else [count, points] = [5, 20]
                else [count, points] = [3, 12]
                return [type, count, 'Any ', String(count), ' words!', points]
            }
            // console.log('invalid generatePrompt()')
        }
    }
    function updateInfoText(infoText) {
        setGameData(prevGameData => ({ ...prevGameData,
            infoText: infoText
        }))
    }
    function pseudorandomizeAlien() {
        // pick random styling, but guarantee no consecutive styling
        let alien
        do {
            // todo fix this hardcoded number 5
            alien = Math.floor(Math.random() * 5) 
        } while (alien === gameData.alien)
        setGameData(prevGameData => ({ ...prevGameData,
            alien: alien
        }))
        return alien
    }
    function longestWord() {
        let longestWord = ""
        for (const usedWord of usedWords) {
            if (usedWord.word.length > longestWord.length) longestWord = usedWord.word
        }
        return `${longestWord} (+${longestWord.length})`
    }

    const usedWordsElements = usedWords.map(({id, word, className}) => (
        <UsedWord
            key={id}
            word={word} 
            className={className}
        />
    ))
    function formatPowerWord(word) {
        const length = 20
        if (word.length > length) {
            word = word.slice(0,length) + "..."
        }
        return word
    }
    function formatPowerWords(words) {
        // for the future, make this scalable
        const wordArray = [[0,words[0]],[1,words[1]],[2,words[2]]]
        return wordArray.map(([key, word]) => 
            <div key={key}>{formatPowerWord(word)}</div>
        )
    }

    function endCombo() {
        setGameData(prev => ({...prev,
            comboIsActive: false,
            multiplier: 1,
            combo: 0
        }))
    }


    return (<>
        <div className="navbar-game">
            <VolumeSliders
                gameData={gameData}
                previewSFX={playSFXKeypress}
                changeVolume={(category, volume) => setGameData(prevGameData => ({ ...prevGameData,
                    [category]: volume
                }))}
                volumeCollapse={volumeCollapse}
            />
            <div className={`menu-game${menuCollapse ? ' hide' : ''}`}>
                {window.django.isAuthenticated ? <>
                    <div className='menu-info'><span>{window.djangoProfile.username}</span><em>Lv {window.djangoProfile.level}</em></div>
                    {!window.djangoProfile.wildcards.every(word => word === "") && <> 
                        <div className='menu-info'>"Refresh" spellwords</div>
                        <div className='menu-info'>{formatPowerWords(window.djangoProfile.wildcards)}</div>
                    </>}
                    {window.djangoProfile.extender && <> 
                        <div className='menu-info'>"Attract" spellwords</div>
                        <div className='menu-info'>{formatPowerWord(window.djangoProfile.extender)}</div>
                    </>}

                    <a className='menu-link' href={window.django.profileURL}><div>Profile</div></a>
                    <a className='menu-link' href={window.django.logoutURL}><div>Log Out</div></a>
                </> : <>
                    <a className='menu-link' href={window.django.loginURL}><div>Log In</div></a>
                    <a className='menu-link' href={window.django.registerURL}><div>Register</div></a>
                    <a className='menu-link' href={window.django.leaderboardURL}><div>Rankings</div></a>
                </>}
            </div>
        </div>
        <div className={`navbar-game-closer${volumeCollapse ? '' : ' show'}`} onClick={toggleVolume}></div>
        <div className={`navbar-game-closer${menuCollapse ? '' : ' show'}`} onClick={toggleMenu}></div>


        <div className={`tutorial-wrapper${tutorialCollapse ? ' hide' : ''}`}>
            <Tutorial 
                isCompact={gameData.isCompact}
                toggleTutorial={toggleTutorial}
            />
        </div>
        <div className={`tutorial-closer${tutorialCollapse ? '' : ' show'}`} onClick={toggleTutorial}></div>


        <div className="game-area">
            <div className={`game ${gameData.isFinished ? "finished" : ""}`}>
                <Alien
                    isPlaying={gameData.isPlaying}
                    currentAlien={gameData.alien}
                    prompt={gameData.prompt}
                    musicLoaded={gameData.musicLoaded}
                    isCompact={gameData.isCompact}
                />
                <Textbox 
                    isPlaying={gameData.isPlaying}
                    evaluateWord={evaluateWord}
                    startGame={startGame}
                    playSFXKeypress={playSFXKeypress}
                    isCompact={gameData.isCompact}
                    musicLoaded={gameData.musicLoaded}
                    playHum={playHum}
                    stopHum={stopHum}
                    playSFXValid={playSFXValid}
                    isFinished={gameData.isFinished}
                    exitGame={exitGame}
                />
                <div className={`info-text no-sel ${gameData.musicLoaded !== null ? 'info-text-fader' : ''}`}>
                    {gameData.infoText}
                </div>
                {gameData.isPlaying && <>
                <div className="combo-container">
                    {gameData.comboIsActive && 
                        <Combo
                            combo={gameData.combo}
                            multiplier={gameData.multiplier}
                            endCombo={endCombo}
                            countdown={gameData.comboCountdown}
                        />
                    }
                </div>
                    <GameInfo 
                        gameData={gameData}
                        finishGame={finishGame}
                    />
                    <div className="words-container no-sel">
                        {usedWordsElements}
                    </div>
                </>}
            </div>
            <div className={`results-area ${gameData.isFinished ? "results-area-show" : ""}`}>
                <div className="results">
                    <div className={`results-spacer ${gameData.isCompact ? 'compact' : ''}`}></div>
                    <h1>Encounter Complete!</h1>
                    <p>Total Dust: 💠 {gameData.score}</p>
                    <p>Creatures Helped: 👾 {gameData.helped}</p>
                    <p>Total Words: {usedWords.length}</p>
                    <p>Longest Chain: {gameData.bestCombo}</p>
                    <p>Average Multiplier: {
                        Number.isNaN(gameData.totalMultiplier/usedWords.length) ? 1.00 :
                        (gameData.totalMultiplier/usedWords.length).toFixed(2)
                    }x</p>
                    <p>Longest Word: {longestWord()}</p>
                    {window.django.isAuthenticated ?
                        <p>{gameData.isSaved ? "Game Saved!" : "Saving..."}</p>
                    :
                        <p>Log in to begin saving!</p>
                    }
                    <button className="bouncy-button" onClick={exitGame}>Finish!</button>
                </div>
            </div>
        </div>
    </>)
}