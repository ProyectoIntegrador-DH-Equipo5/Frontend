import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { reducer } from "../reducers/reducer";
import data from "./data.json";

export const ContextGlobal = createContext(undefined);

export const initialState = { theme: "light", data: [], user: null };

export const ContextProvider = ({ children }) => {
    
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isMobile, setIsMobile] = useState(false);

    // evaluar si es mobile
    const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 769);
    };

    useEffect(() => {
        checkIfMobile(); 
        window.addEventListener("resize", checkIfMobile); 

        return () => {
            window.removeEventListener("resize", checkIfMobile); 
        };
    }, []);


    // cargar usuario desde localStorage al iniciar aplicación
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            dispatch({ type: "SET_USER", payload: JSON.parse(savedUser) });
            }
            }, []);

    // guardar usuario en localStorage cada vez que el estado cambia
    useEffect(() => {
        if (state.user) {
            localStorage.setItem("user", JSON.stringify(state.user));
        } else {
            localStorage.removeItem("user");
        }
    }, [state.user]);



    /* const url =
    "http://localhost:8080/obra/listartodos"; //url local para conectar con backend
    
        useEffect(() => {
    axios(url).then((res) => {
      console.log(res.data);
      dispatch({ type: "GET_ART", payload: res.data });
    });
  }, []);

    */

    const url = data; // Prueba con data.json

    useEffect(() => {
        dispatch({ type: "GET_ART", payload: url });
    }, []);

    // función para gestionar login de usuario
    const loginUser = (user) => {
        dispatch({ type: "SET_USER", payload: user });
    }

    // gestionar el cierre de sesión del usuario
    const logoutUser = () => {
        dispatch({ type: "SET_USER", payload: null });
        localStorage.removeItem("user");
    }

    return (
        <ContextGlobal.Provider value={{ state, dispatch, isMobile, loginUser, logoutUser }}>
            {children}
        </ContextGlobal.Provider>
    );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);