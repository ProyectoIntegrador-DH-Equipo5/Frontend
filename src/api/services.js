import axiosConfig from "./axiosConfig";

export const obrasService = {
    getObras: async () => {
        try {
            const response = await axiosConfig.get("/obra/listartodos");
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getObra: async (id) => {
        try {
            const response = await axiosConfig.get(`/obra/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    createObra: async (obra) => {
        try {
            const response = await axiosConfig.post("/obra", obra, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log("Response:", response);
            return response.data;
        } catch (error) {
            console.error("Error al crear la obra:", error);
            throw error;
        }
    },


    updateObra: async (obra) => {
        try {
            const response = await axiosConfig.put("/obra", obra);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    deleteObra: async (id) => {
        try {
            const response = await axiosConfig.delete(`/obra/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
};