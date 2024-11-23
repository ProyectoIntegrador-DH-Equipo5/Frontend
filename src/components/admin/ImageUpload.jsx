import React, { useState, useEffect } from "react";
import { useContextGlobal } from "../../utils/global.context";

const ImageUpload = ({ onFilesAdded, imagenesAdicionales }) => {
    const { dispatch, state } = useContextGlobal();
    const images = state.images || []; // Fetch images from global state
    const existingImages = imagenesAdicionales || []; // Existing images passed as prop

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
        console.log("Deleting image:", url);
        dispatch({
            type: "DELETE_IMAGE",
            payload: { id: url },
        });
    };

    const addFile = (file) => {
        // Asegúrate de que la imagen no esté ya en la lista para evitar duplicados
        const imageExists = images.some(existingImage => existingImage.nombre === file.nombre); // Comparar por nombre
        if (!imageExists) {
            // Crea una URL de objeto para los archivos no procesados
            const fileUrl = URL.createObjectURL(file);
            // Primero, añade la imagen al estado global
            dispatch({
                type: "ADD_IMAGE",
                payload: { ...file, url: fileUrl  }, // Añade la URL generada
            });
            onFilesAdded(file); // Llamar a callback para añadir el archivo
        } else {
            console.log("Imagen duplicada detectada:", file.name);
        }
    };

    const allImages = [...existingImages, ...images];
    console.log("All images:", allImages); // Verifica las URLs de las imágenes en la consola

    return (
        <div
            className="mt-4 border-2 border-dashed border-gray-400 py-12 flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} 
            onClick={(e) => e.stopPropagation()}
        >
            <p className="mb-3 font-semibold text-gray-900">Arrastra y suelta tus archivos aquí o</p>
            <input
                id="hidden-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()} 
            />
            <button
                className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById("hidden-input").click();
                }}
            >
                Cargar un archivo
            </button>
            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">Imágenes</h1>
            <ul className="flex flex-wrap m-1 w-full justify-center align-center gap-2">
                {allImages.length === 0 ? (
                    <li className="h-full w-full text-center flex flex-col items-center justify-center">
                        <img
                            className="mx-auto w-32"
                            src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                            alt="no data"
                        />
                        <span className="text-small text-gray-500">No hay archivos seleccionados</span>
                    </li>
                ) : (
                    allImages.map((image, index) => {
                        // Si el archivo es en bruto, creamos una URL local para la vista previa
                        const imageUrl = image?.url ? image.url : URL.createObjectURL(image);

                        return (
                            <li key={index} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24 relative">
                                <article className="group w-full h-full rounded-md bg-gray-100 cursor-pointer relative shadow-sm">
                                    <img
                                        alt="preview"
                                        className="img-preview w-full h-full object-cover rounded-md"
                                        src={imageUrl} // Usar imageUrl para asegurarte de que siempre se pasa la URL correcta
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-600 bg-gray-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(imageUrl); // Elimina usando la URL correcta
                                        }}
                                    >
                                        X
                                    </button>
                                </article>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default ImageUpload;
