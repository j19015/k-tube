//SignUp.tsxのsubmitボタンを押すと、APIへデータを送信し、ユーザー情報をDBに登録できるようにする

export class User{
    userName: string
    password: string

    constructor(
        userName:string, password:string){
            this.userName = userName
            this.password = password
        }
}