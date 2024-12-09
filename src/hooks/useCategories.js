import { useState } from 'react';
import { useContextGlobal } from '../utils/global.context';
import { categoriaService } from '../api/categoriaService';

export const useCategories = (onSuccess) => {
    const { dispatch } = useContextGlobal();
    const [newCategory, setNewCategory] = useState({
        nombre: "",
        descripcion: "",
        imagen: null,
        previewUrl: null
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                setNewCategory(prev => ({
                    ...prev,
                    imagen: file,
                    previewUrl: URL.createObjectURL(file)
                }));
            }
        } else {
            setNewCategory(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const submitCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await categoriaService.getCategorias();
            const existingCategories = response;

            const duplicateCategory = existingCategories.find(
                (category) => category.nombre.toLowerCase() === newCategory.nombre.toLowerCase()
            );

            if (duplicateCategory) {
                throw new Error("La categoría ya existe.");
            }

            const formData = new FormData();
            formData.append('nombre', newCategory.nombre);
            formData.append('descripcion', newCategory.descripcion);
            
            if (newCategory.imagen instanceof File) {
                formData.append('file', newCategory.imagen);
            }

            const createdCategory = await categoriaService.createCategoria(formData);
            dispatch({ type: "ADD_CATEGORY", payload: createdCategory });
            setNewCategory({ nombre: "", descripcion: "", imagen: null, previewUrl: null });
            
            if (onSuccess) {  //función callback que se ejecutará cuando la categoría se cree exitosamente
                onSuccess(createdCategory);
            }

            return { success: true, category: createdCategory };
        } catch (error) {
            throw new Error(error.message || "Hubo un error al crear la categoría");
        }
    };

    return {
        newCategory,
        handleInputChange,
        submitCategory,
        setNewCategory
    };
};