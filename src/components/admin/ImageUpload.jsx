import React, { useState, useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage } from "../../utils/localStorage";

const ImageUpload = ({ onFilesAdded, existingImage }) => {
    const [files, setFiles] = useState({});
    const [images, setImages] = useState(loadFromLocalStorage("images") || []); // Cargar las imágenes del localStorage

    // Función para añadir un archivo y convertirlo a base64
    const addFile = (file) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
            const base64Image = reader.result; // Obtener la imagen en base64
            const newImages = [...images, base64Image]; // Añadirla a la lista de imágenes
            setImages(newImages);
            saveToLocalStorage("images", newImages); // Guardar en localStorage
            onFilesAdded(base64Image); // Llamar al callback con la imagen
        };

        reader.readAsDataURL(file); // Convertir archivo a base64
    };

    const handleFileChange = (e) => {
        e.stopPropagation();
        for (const file of e.target.files) {
            addFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        for (const file of e.dataTransfer.files) {
            addFile(file);
        }
    };

    const handleDelete = (url) => {
        const newImages = images.filter((image) => image !== url);
        setImages(newImages);
        saveToLocalStorage("images", newImages); // Actualizar en localStorage
    };

    useEffect(() => {
        // Si hay una imagen existente, se maneja de forma similar a como se hizo con las imágenes cargadas
        if (existingImage) {
            const objectURL = URL.createObjectURL(existingImage);
            setImages((prevImages) => [...prevImages, objectURL]);
        }
    }, [existingImage]);

    return (
        <div
            className="mt-4 border-2 border-dashed border-gray-400 py-12 flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} // Prevenir el comportamiento predeterminado
            onClick={(e) => e.stopPropagation()} // Prevenir la propagación del click
        >
            <p className="mb-3 font-semibold text-gray-900">Arrastra y suelta tus archivos aquí o</p>
            <input
                id="hidden-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()} // Prevenir la propagación del click
            />
            <button
                className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={(e) => {
                    e.preventDefault(); // Evitar cualquier comportamiento predeterminado
                    e.stopPropagation(); // Evitar el cierre del formulario
                    document.getElementById("hidden-input").click();
                }}
            >
                Cargar un archivo
            </button>
            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">Imágenes</h1>
            <ul className="flex flex-wrap m-1 w-full justify-center align-center gap-2">
                {images.length === 0 ? (
                    <li className="h-full w-full text-center flex flex-col items-center justify-center">
                        <img
                            className="mx-auto w-32"
                            src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                            alt="no data"
                        />
                        <span className="text-small text-gray-500">No hay archivos seleccionados</span>
                    </li>
                ) : (
                    images.map((url, index) => (
                        <li key={index} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24 relative">
                            <article className="group w-full h-full rounded-md bg-gray-100 cursor-pointer relative shadow-sm">
                                <img
                                    alt="preview"
                                    className="img-preview w-full h-full object-cover rounded-md"
                                    src={url} // Usar la URL base64
                                />
                                <button
                                    className="absolute top-1 right-1 focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-600 bg-gray-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(url);
                                    }}
                                >
                                    X
                                </button>
                            </article>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ImageUpload;
