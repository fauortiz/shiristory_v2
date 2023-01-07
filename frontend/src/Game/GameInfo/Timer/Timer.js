import React from "react"

// import './Timer.css'

export default function Timer({finishGame, baseTime, bonusTime}) {

    const [timer, setTimer] = React.useState(baseTime)
    
    React.useEffect(() => {

        if (timer === 0 - bonusTime) {
            finishGame()
        }
        setTimeout(() => {
            setTimer(oldTime => oldTime - 1)
        }, 1000)
    // TODO fix this error? seems to work fine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer])

    function formatTimer() {
        const time = timer + bonusTime
        // return `${(time - time % 10) / 10}.${time % 10}`
        // return `${(time - time % 60)/60}:${(time % 60).toLocaleString('en-US', {
        //     minimumIntegerDigits: 2,
        //     useGrouping: false
        //   })}`
        return time
    }

    // console.log('Timer renders')
    return (
        <>
            <div className="timer">
                ⏱{formatTimer()}
            </div>
        </>
    )
}