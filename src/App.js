import { useEffect, useState } from "react";
import Home from "./pages/home";
import Login from "./pages/login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { socket } from './socket';
import { createContext  } from "react";
import { AddDevice } from "./pages/addDevice";
//const serverUrl = "https://ce232-do-an-server.onrender.com";
const serverUrl = "";

export const AppContext = createContext(null);

function App() {
    const [loggedIn, setLoggedIn] = useState(() => undefined);
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
      function onConnect() {
        setIsConnected(true);
        console.log("socket connected")
      }
  
      function onDisconnect() {
        setIsConnected(false);
      }
  
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
  
      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }, []);

    useEffect(() => {
        fetch(`${serverUrl}/auth/isLoggedIn`)
            .then((res) => res.json())
            .then((res) => {
              setLoggedIn(res.loggedIn)
              console.log("logged in: ", res.loggedIn)
            });
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home loggedIn={loggedIn}/>,
            children : [{
              path: "add/",
              element: <AddDevice />
            }],
        },
        {
            path: "/login",
            element: <Login setLoggedIn={setLoggedIn}/>,
        },
    ]);

    return (
        <div>
          <AppContext.Provider value={{socket}}>
            <RouterProvider router={router} />
          </AppContext.Provider>
        </div>
    );
}

export {App, serverUrl};
