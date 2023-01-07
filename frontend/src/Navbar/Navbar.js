
import "./Navbar.css"

export default function Navbar({ toggleVolume, toggleTutorial, toggleMenu }) {


    // console.log('render Navbar')
    return (
        <div className="navbar">
            <div className="navbar-spacer"></div>

            <a className="navbar-brand" href={window.django.indexURL}>
                <div className="navbar-logo">SHIRISTORY</div>
                <div className="navbar-demo">demo version</div>
            </a>
            

            <div className="navbar-menu">
            {window.django.isAuthenticated ? <>
                <div className="navbar-button navbar-authenticated navbar-big-button" onClick={toggleMenu}>
                    <span className="navbar-username"><span>{window.djangoProfile.username}</span></span>
                    <div className="navbar-unpacked-2">👤</div>
                    <div className="navbar-packed-2">{window.djangoProfile.username[0].toUpperCase()}</div>
                </div>
            </> :
                <>
                    <a className="navbar-button navbar-unpacked" href={window.django.loginURL}><div>Log In</div></a>
                    <a className="navbar-button navbar-unpacked" href={window.django.registerURL}><div>Register</div></a>
                    <a className="navbar-button navbar-unpacked" href={window.django.leaderboardURL}><div>Rankings</div></a>
                    <div className="navbar-button navbar-unpack" onClick={toggleMenu}><div>👤</div></div>
                </>
            }
                <div className="navbar-button" onClick={toggleVolume}><div>🔉</div></div>
                <div className="navbar-button" onClick={toggleTutorial}><div>❔</div></div>
            </div>
        </div>
    )
}