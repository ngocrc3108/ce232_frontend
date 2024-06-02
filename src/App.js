import { useEffect, useState } from "react";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { socket } from "./socket";
import { createContext } from "react";
import { AddDevice } from "./pages/addDevice";

export const serverUrl = process.env.NODE_ENV == 'production' ? "https://ce232-backend.onrender.com" : "";

export const myFetch = async (path, { body, method } = {}) => {
    let options = {
        method: method || "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    }

    if(process.env.NODE_ENV == 'production')
        options = {...options,
            mode: "cors",
            credentials: "include"
        }

    return fetch(`${serverUrl}${path}`, options)
	.then((res) => res.json());
};

export const AppContext = createContext(null);

export function App() {

    
    const [loggedIn, setLoggedIn] = useState(() => undefined);
    const [isConnected, setIsConnected] = useState(() => socket.connected);
    
    useEffect(() => {
        console.log("NODE_ENV", process.env.NODE_ENV)

        function onConnect() {
            setIsConnected(true);
            console.log("socket connected");
            myFetch("/auth/isLoggedIn", {
                method : 'GET'
            })
            .then((res) => {
                setLoggedIn(res.loggedIn);
                console.log("logged in: ", res.loggedIn);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home loggedIn={loggedIn} />,
            children: [
                {
                    path: "add/",
                    element: <AddDevice />,
                },
            ],
        },
        {
            path: "/login",
            element: <Login setLoggedIn={setLoggedIn} />,
        },
        {
            path: "/register",
            element: <Register/>,
        },
    ]);

    return (
        <div>
            <AppContext.Provider value={{ socket }}>
                <RouterProvider router={router} />
            </AppContext.Provider>
        </div>
    );
}