import React from "react"

// import './Timer.css'
import ComboTimer1 from "./ComboTimer/ComboTimer1.js"
import ComboTimer2 from "./ComboTimer/ComboTimer2.js"

export default function Combo({multiplier, combo, endCombo, countdown}) {

    const [restarter, setRestarter] = React.useState(false)

    // if combo changes, BLOW UP AND RENEW ComboTimer
    React.useEffect(() => {
        setRestarter(restarter => !restarter)
    }, [combo])

    // comboCountdown is in Combo component

    // console.log('Combo renders')
    return (
        <>
        <div className={`${multiplier === 4 ? 'max-multiplier' : ''}`}><em><strong>{multiplier}</strong>x</em></div>
        <em>
            { restarter ?
                <ComboTimer1 
                    countdown={countdown}
                    endCombo={endCombo}
                />
            :
                <ComboTimer2 
                    countdown={countdown}
                    endCombo={endCombo}
                />
            }
            </em>
            <div className="timer">
                <em><strong>{combo}</strong><span class="small">chain</span></em>
            </div>
        </>
    )
}
