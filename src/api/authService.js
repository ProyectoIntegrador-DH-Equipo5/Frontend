import axiosConfig from "./axiosConfig";

export const authService = {
    // Registro de usuarios
    register: async (userData) => {
        try {
            const response = await axiosConfig.post("/api/auth/register", userData);
            return response.data;
        } catch (error) {
            console.error("Error en el registro de usuario:", error);
            throw error;
        }
    },
    
    // Inicio de sesión
    login: async (credentials) => {
        try {
            const response = await axiosConfig.post("/api/auth/login", credentials);
            const token = response.data.token;
            // Guardar el token en el localStorage (o en el estado de la aplicación si prefieres)
            localStorage.setItem("authToken", token);
            // Configurar el token para que sea utilizado en todas las solicitudes subsiguientes
            axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return response.data;
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw error;
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
