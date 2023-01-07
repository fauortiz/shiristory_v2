import React from "react"

// import './TotalHelped.css'

export default function TotalHelped({helped}) {
    return (
        <div id="total-helped-area">
            👾<span id="total-helped">{helped}</span>
        </div>
    )
}