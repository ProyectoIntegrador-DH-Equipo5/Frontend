import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { reducer } from "../reducers/reducer";
import data from "./data.json";
import categories from './category.json';
import users from "./user.json";
import { 
    saveToLocalStorage, 
    loadFromLocalStorage, 
    removeFromLocalStorage 
} from "./localStorage"; // Importar funciones de localStorage

export const ContextGlobal = createContext(undefined);

export const initialState = {
    theme: "light",
    data: loadFromLocalStorage("data") || [],
    categories: loadFromLocalStorage("categories") || [],
    users: loadFromLocalStorage("users") || [],
    images: loadFromLocalStorage("images") || [],  // Cargar imágenes desde localStorage
    activeSection: "obras",
    user: null,
    loggedUser: loadFromLocalStorage("loggedUser") || null,
    favorites: loadFromLocalStorage("favorites") || [],
};

    const cloudName = "dr1jbzn9r"; // Tu nombre de nube
    const uploadPreset = "ml_default"


export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isMobile, setIsMobile] = useState(false);

    // Evaluar si es mobile
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

    // Cargar datos de "data.json" si no están en localStorage
    const url = data;
    useEffect(() => {
        if (!loadFromLocalStorage("data")) {
            dispatch({ type: "GET_ART", payload: url });
        }
    }, []);

    // Cargar categorías desde "category.json" o localStorage
    const urlCategories = categories;
    useEffect(() => {
        if (!loadFromLocalStorage("categories")) {
            dispatch({ type: "GET_CATEGORIES", payload: urlCategories });
        }
    }, []);

    // Cargar usuarios desde "user.json" o localStorage
    const urlUsers = users;
    useEffect(() => {
        if (!loadFromLocalStorage("users")) {
            dispatch({ type: "GET_USERS", payload: urlUsers });
        }
    }, []);

    // Guardar cambios de data, categorías y usuarios en localStorage
    useEffect(() => {
        saveToLocalStorage("data", state.data);
        saveToLocalStorage("categories", state.categories);
        saveToLocalStorage("users", state.users);
    }, [state.data, state.categories, state.users]);

    // Guardar las imágenes en localStorage cuando cambien
    useEffect(() => {
        if (state.images.length > 0) {
            saveToLocalStorage("images", state.images);
        }
    }, [state.images]);

   

    return (
        <ContextGlobal.Provider value={{ state, dispatch, isMobile }}>
            {children}
        </ContextGlobal.Provider>
    );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);