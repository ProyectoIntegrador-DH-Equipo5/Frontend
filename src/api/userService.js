import axiosConfig from "./axiosConfig";

export const userService = {

    getUsers: async () => {
        try {
            const response = await axiosConfig.get("/usuario/listartodos");
            return response.data;
        } catch (error) {
            console.error("Error al obtener todos los usuarios:", error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await axiosConfig.get(`/usuario/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener usuario por ID:", error);
            throw error;
        }
    },

    updateUser: async (userData) => {
        try {
            const response = await axiosConfig.put("/usuario", userData);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            throw error;
        }
    },

    deleteUserById: async (id) => {
        try {
            const response = await axiosConfig.delete(`/usuario/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error al eliminar usuario por ID:", error);
            throw error;
        }
    }
};
