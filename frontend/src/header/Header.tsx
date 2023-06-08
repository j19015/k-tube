import React from 'react';
import './Header.css'

function Header(){
    return(
        <header className="header01">
            <h1 className="header01-logo">V-Tube</h1>
            <nav className="header01-nav">
                <ul className="header01-list">
                    <li className="header01-item"><a href="">SinIn</a></li>
                    <li className="header01-item"><a href="">SignUp</a></li>
                    <li className="header01-item"><a href="">Movies</a></li>
                    <li className="header01-item header01-item--contact"><a href="">Upload</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;