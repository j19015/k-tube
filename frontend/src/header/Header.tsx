import React, {useState} from 'react';
import './Header.css'

function Header(props: any){
    const [childState, setChildState] = useState('');
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChildState(value);
    
        // 親コンポーネントに値を渡す
        props.onChildStateChange(value);
      };
    return(
        <header className="header01">
            <h1 className="header01-logo">V-Tube</h1>
            <nav className="header01-nav">
                <ul className="header01-list">
                    <li className="header01-item"><a href="">SinIn</a></li>
                    <li className="header01-item"><a href="">SignUp</a></li>
                    <li className="header01-item"><a href="">Movies</a></li>
                    <li className="header01-item header01-item--contact">{/*<a value={childState} onChange={handleInputChange}>Upload</a>*/}
                    <button onClick={props.onUploadButtonClicked}>Upload</button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;