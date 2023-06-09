import {Component} from 'react';
import logo from './logo.svg';
import {User} from './user'


function Register() {

    return (
        <form>
            <h1>ユーザー登録</h1>
            user name<input value="" />
            password<input value="" />
            <button>register</button>

        </form>
    );
}

export default Register;
