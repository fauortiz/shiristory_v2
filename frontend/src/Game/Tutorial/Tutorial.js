import { useState } from "react"

import "./Tutorial.css"

export default function Tutorial({isCompact, toggleTutorial}) {

    const [tutorialPage, setTutorialPage] = useState('index')
    
    return (
        <div className={`tutorial${isCompact ? ' compact' : ''}`}>
            
            <button className="bouncy-button close" onClick={toggleTutorial}>x</button>

            <div className={`tutorial-page index${tutorialPage === 'index' ? " show" : ""}`}>
                <div className="tutorial-header">Welcome to</div>
                <div className="shiristory-logo">SHIRISTORY</div>
                <div className="line-break"></div>
                <div className="button-flex">
                    <button className="bouncy-button" onClick={()=>setTutorialPage('basic')}>How to Play</button>
                    <button className="bouncy-button" onClick={()=>setTutorialPage('power')}>Level up</button>
                    <button className="bouncy-button small" onClick={()=>setTutorialPage('extra')}>About</button>
                </div>
                <div className="line-break"></div>
                <p className="tutorial-small tutorial-tips">Click the ❔ on the navbar to access this screen again.</p>
            </div>

            <div className={`tutorial-page basic${tutorialPage === 'basic' ? " show" : ""}`}>
                <div className="shiristory-logo">SHIRISTORY</div>
                <div className="tutorial-header">How to Play</div>
                <div className="line-break"></div>
                <p><em className="tutorial-small tutorial-tips">
                    Curious creatures arrive from another world!<br></br>
                    Fulfill their requests to fend them off!
                </em></p>
                <div className="line-break"></div>
                <p className="tutorial-rules">Rapidly input words to earn 💠<span className="tutorial-highlight">dust</span>!</p>
                <p className="tutorial-rules">However, you <em><strong>must</strong></em> use the last letter of each word as the first letter of the next, creating a <em><strong className="yellow">word chain</strong></em>!</p>
                <p className="tutorial-rules">Earn more 💠<span className="tutorial-highlight">dust</span> by completing the creatures' requests as you chain words!</p>
                <p className="tutorial-rules">Multiply the 💠<span className="tutorial-highlight">dust</span> you collect by sustaining longer word chains!</p>
                <p className="tutorial-small tutorial-tips">Input an ellipsis (...) to quit your current game.</p>
                <div className="line-break"></div>
                <button className="bouncy-button" onClick={()=>setTutorialPage('index')}>Back</button>
            </div>

            <div className={`tutorial-page power${tutorialPage === 'power' ? " show" : ""}`}>
                <div className="shiristory-logo">SHIRISTORY</div>
                <div className="tutorial-header">Attunement and Spellwords</div>
                <div className="line-break"></div>
                <p className="tutorial-rules">Log in and view your 👤<span className="tutorial-highlight">profile</span> to spend your 💠<span className="tutorial-highlight">dust</span> to augment your abilities!</p>
                <p className="tutorial-rules"><em><strong className="yellow">Attunement levels</strong></em> increase the amount of 💠<span className="tutorial-highlight">dust</span> you collect during encounters.</p>
                <p className="tutorial-rules"><em><strong className="yellow">Spellwords</strong></em> are words that release a powerful effect when used during an encounter. Create your own spellwords to suit your strategy!</p>
                <p className="tutorial-small tutorial-tips">All dust costs are lowered for this demo version.</p>
                <div className="line-break"></div>
                <button className="bouncy-button" onClick={()=>setTutorialPage('index')}>Back</button>
            </div>

            <div className={`tutorial-page extra${tutorialPage === 'extra' ? " show" : ""}`}>
                <div className="shiristory-logo">SHIRISTORY</div>
                <div className="tutorial-header">About the Game</div>
                <div className="line-break"></div>
                <p className="tutorial-rules">Created by Francis Ortiz for CS50 Web.</p>
                <div className="line-break"></div>
                <button className="bouncy-button" onClick={()=>setTutorialPage('index')}>Back</button>
            </div>

        </div>
    )
}