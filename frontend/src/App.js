import React, { useEffect, useState } from "react"

import './App.css'
import Game from "./Game/Game.js"
import Navbar from "./Navbar/Navbar.js"

export default function App() {

    const [navbarCollapse, setNavbarCollapse] = useState({
        volume: true,
        tutorial: true,
        menu: true
    })

    const toggleVolume = () => {
        setNavbarCollapse(prev => ({...prev,
            volume: !prev.volume,
            tutorial: true,
            menu: true
        }))
    }

    const toggleTutorial = () => {
        setNavbarCollapse(prev => ({...prev,
            volume: true,
            tutorial: !prev.tutorial,
            menu: true
        }))
    }

    const toggleMenu = () => {
        setNavbarCollapse(prev => ({...prev,
            volume: true,
            tutorial: true,
            menu: !prev.menu
        }))
    }

    useEffect(() => {
        // pop up tutorial if not logged in
        if (!window.django.isAuthenticated) {
            setNavbarCollapse(prev => ({...prev,
                tutorial: false
            }))
        }
    }, [])


    // console.log('render App')
    return (
        <>
            <div id='stars1' className="stars"></div>
            <div id='stars2' className="stars"></div>
            <div id='stars3' className="stars"></div>
            <div className="app">
                <Navbar
                    toggleVolume={toggleVolume}
                    toggleTutorial={toggleTutorial}
                    toggleMenu={toggleMenu}
                />
                <Game 
                    volumeCollapse={navbarCollapse.volume}
                    toggleVolume={toggleVolume}
                    tutorialCollapse={navbarCollapse.tutorial}
                    toggleTutorial={toggleTutorial}
                    menuCollapse={navbarCollapse.menu}
                    toggleMenu={toggleMenu}
                />
            </div>
        </>
    )
}