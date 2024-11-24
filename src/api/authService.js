import axiosConfig from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

export const authService = {
    // Registro de usuarios
    register: async (userData) => {
        try {
            const response = await axiosConfig.post("/api/auth/register", userData);
            return response.data;
        } catch (error) {
            console.error("Error en el registro de usuario:", error);
            throw error; // Reenvía el error para manejarlo en `handleSubmitUser`
        }
    },

    login: async (credentials) => {
        try {
            const response = await axiosConfig.post("/api/auth/login", credentials);
            const { token } = response.data;

            // Almacenar el token
            localStorage.setItem("token", token);

            // Opcional: Decodificar y guardar el usuario en localStorage
            const user = jwtDecode(token);
            localStorage.setItem("loggedUser", JSON.stringify(user));

            return user;
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw error.response?.data?.message || "Error al iniciar sesión";
        }
    },
    
    // Obtener detalles de usuario (requiere token)
    getUserDetails: async (token) => {
        try {
            const response = await axiosConfig.get("/usuario/detalles", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error("Error al obtener detalles del usuario:", error);
        }
    },
};
