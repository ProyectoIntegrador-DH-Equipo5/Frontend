import axiosConfig from "./axiosConfig";

export const categoriaService = {
  getCategorias: async () => {
      try {
          const response = await axiosConfig.get("/movimientoArtistico/listartodos", {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
      } catch (error) {
        console.error("Error al obtener todas las categorias: ", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
  },

  getCategoria: async (id) => {
      try {
          const response = await axiosConfig.get(`/movimientoArtistico/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          return response.data;
      } catch (error) {
          console.error("Error al obtener la categoria: ", error);
          if (error.response) {
              console.error("Response data:", error.response.data);
          }
          throw error;
      }
  },

  createCategoria: async (categoria) => {  
      try {
          
          const response = await axiosConfig.post("/movimientoArtistico", categoria, {
              headers: {
                  "Content-Type": "application/json", 
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });
          console.log("Response:", response);
          return response.data;
      } catch (error) {
          console.error("Error guardando la categoria:", error);
          if (error.response) {
              console.error("Response data:", error.response.data);
          }
          throw error;
      }
  },

  updateCategoria: async (categoria) => {
      try {
        const response = await axiosConfig.put("/movimientoArtistico", categoria, {
          headers: {
              "Content-Type": "application/json", 
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
          return response.data;
      } catch (error) {
          console.error("Error actualizando la categoria:", error);
          if (error.response) {
              console.error("Response data:", error.response.data);
          }
          throw error;
      }
  },

  deleteCategoria: async (id) => {
      try {
          const response = await axiosConfig.delete(`/movimientoArtistico/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });
          return response.data;
      } catch (error) {
          console.error("Error en la eliminacion de categoria:", error);
          if (error.response) {
            throw new Error(error.response.data || "Error desconocido al eliminar la categoría.");
          }else{
            throw new Error("No se pudo eliminar la categoria. Por favor, verifica tu conexión o intenta nuevamente.");
          } 
      }
  },
}