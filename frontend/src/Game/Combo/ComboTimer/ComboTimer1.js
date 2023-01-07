import React from "react"

// import './Timer.css'

export default function ComboTimer1({countdown, endCombo}) {

    const [timer, setTimer] = React.useState(countdown)
    
    React.useEffect(() => {

        if (timer === 0) {
            endCombo()
        }
        setTimeout(() => {
            setTimer(oldTime => oldTime - 1)
        }, 100)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer])

    function formatTimer() {
        return `${(timer - timer % 10) / 10}.${timer % 10}`
        // return `${(timer - timer % 60)/60}:${(timer % 60).toLocaleString('en-US', {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false
        //   })}`
        // return timer
    }

    // console.log('ComboTimer1 renders')
    return (
        <>
            <div className={`timer${timer <= 20 ? ' low-timer' : ''}`}>
                {formatTimer()}
            </div>
        </>
    )
}