
import "./UsedWord.css"

export default function UsedWord({word, className}) {

    
    // console.log('render UsedWord')
    return (
        <span className={className}>{word}</span>
    )
}