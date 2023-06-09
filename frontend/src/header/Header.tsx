import React, {useState} from 'react';
import './Header.css'
const clientUrl = process.env.REACT_APP_CLIENT_URL;

function Header(props: any){
    const { session_status } = props; // propsからsession_statusを受け取る
    const [childState, setChildState] = useState('');
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setChildState(value);
    
        // 親コンポーネントに値を渡す
        props.onChildStateChange(value);
    };
    const handleSessionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        //setChildState(value);
    
        // 親コンポーネントに値を渡す
        props.onChildSessionChange(false);
    }
    const signout=()=>{
        props.onSessionButtonClicked()
        fetch(`${clientUrl}/signout`, { method: 'POST', credentials: 'include' })
        .then(() => {
            console.log("ログアウト成功")
        })
        .catch((error) => {
            console.error(error);
        });
    }
    return(
        <header className="header01">
            <h1 className="header01-logo">V-Tube</h1>
            <nav className="header01-nav">
                <ul className="header01-list">
                    {
                        session_status?(
                            <>
                                <li className="header01-item">LoginUserID: {props.userId}</li>
                                <button onClick={signout}>SignOut</button>
                            </>
                        ):(
                            <>  
                                <li className="header01-item"><button onClick={props.onSignInButtonClicked}>SignIn</button></li>
                                <li className="header01-item"><button onClick={props.onSignUpButtonClicked}>SignUp</button></li>
                            </>
                        )
                    }
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