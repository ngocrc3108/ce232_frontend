import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { myFetch } from "../App";


function Login({setLoggedIn}) {
    const [username, setUsername] = useState(() => "");
    const [password, setPassowrd] = useState(() => "");
    const [errMessage, setErrMessage] = useState(() => "");
    const navigate = useNavigate();

    const onButtonClick = async () => {
        const {success, message} = await myFetch('/auth/login', {
            body : {username, password}
        })

        setLoggedIn(success)
        setErrMessage(message)

        if(success)
            navigate("/")
    }

    return (
        <div>
            <input
                value={username}
                placeholder="username"
                onChange={(ev) => setUsername(ev.target.value)}
                className={"inputBox"}
            />
            <input
                value={password}
                placeholder="password"
                onChange={(ev) => setPassowrd(ev.target.value)}
                className={"inputBox"}
            />
            <p>{errMessage}</p>
            <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
        </div>

    );
}

export default Login;