import React, { useState, useEffect } from "react";
import { useContextGlobal } from "../../utils/global.context";

const ImageUpload = ({ onFilesAdded, existingImages, imagenesAdicionales }) => {
    //const { dispatch, state } = useContextGlobal();
    const [localImages, setLocalImages] = useState([]); // Nuevo estado local
    //const images = state.images || []; // Fetch images from global state
    //const existingImages = imagenesAdicionales || []; // Existing images passed as prop

    // Reinicializar el estado cuando cambian las imágenes adicionales
    useEffect(() => {
        //setLocalImages([]);
        // Limpiar URLs de objeto al desmontar
        return () => {
            localImages.forEach(img => {
                if (!img.isExisting) {
                    URL.revokeObjectURL(img.url);
                }
            });
        };
    }, [localImages]); 

     // Inicializar imágenes cuando se reciben imagenesAdicionales
     useEffect(() => {
         // Limpiar estado anterior
        if (imagenesAdicionales && imagenesAdicionales.length > 0) {
            const formattedImages = imagenesAdicionales.map(img => ({
                url: typeof img === 'string' ? img : URL.createObjectURL(img),
                file: typeof img === 'string' || img.imagenId ? null : img,
                isExisting: typeof img === 'string' || img.imagenId ? true : false,
                imagenId: img.imagenId // Preservar el imagenId si existe
            }));
            setLocalImages(formattedImages);
        } else {
            setLocalImages([]);
        }
    }, [imagenesAdicionales]);


    const handleFileChange = (e) => {
        e.stopPropagation();
        const newFiles = Array.from(e.target.files);
        const updatedImages = [...localImages];
        
        newFiles.forEach(file => {
            const isDuplicate = localImages.some(img => 
                img.file && img.file.name === file.name && img.file.size === file.size
            );

            if (!isDuplicate) {
                const fileUrl = URL.createObjectURL(file);
                updatedImages.push({
                    url: fileUrl,
                    file: file,
                    isExisting: false
                });
            }
        });

        setLocalImages(updatedImages);
        
        // Notificar al componente padre con la lista actualizada de archivos
        const allFiles = updatedImages.map(img => img.isExisting ? img.url : img.file);
        onFilesAdded(allFiles);
        
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        files.forEach(addFile);
    };

    const handleDelete = (imageToDelete) => {
        const newLocalImages = localImages.filter(img => img.url !== imageToDelete.url);
        setLocalImages(newLocalImages);
        
        if (!imageToDelete.isExisting) {
            URL.revokeObjectURL(imageToDelete.url);
        }
        
        // Notificar al componente padre
        const updatedFiles = newLocalImages.map(img => img.isExisting ? img.url : img.file);
        onFilesAdded(updatedFiles);
    };

    const addFile = (file) => {
        // Verificar si el archivo ya existe
        const isDuplicate = localImages.some(img => 
            img.file && img.file.name === file.name && img.file.size === file.size
        );

        if (!isDuplicate) {
            const fileUrl = URL.createObjectURL(file);
            const newImage = {
                url: fileUrl,
                file: file,
                isExisting: false
            };
            
            setLocalImages(prevImages => [...prevImages, newImage]);
            
            // Notificar al componente padre
            const updatedImages = [...localImages, newImage]
                .map(img => img.isExisting ? img.url : img.file);
            onFilesAdded(updatedImages);
        }
    };

    //const allImages = [...existingImages, ...images];
    //console.log("All images:", allImages); // Verifica las URLs de las imágenes en la consola

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
                {localImages.length === 0 ? (
                    <li className="h-full w-full text-center flex flex-col items-center justify-center">
                        <img
                            className="mx-auto w-32"
                            src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                            alt="no data"
                        />
                        <span className="text-small text-gray-500">No hay archivos seleccionados</span>
                    </li>
                ) : (
                    localImages.map((image, index) => {
                        // Si el archivo es en bruto, creamos una URL local para la vista previa
                        //const imageUrl = image?.url ? image.url : URL.createObjectURL(image);

                        return (
                            <li key={`${image.url}-${index}`} className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24 relative">
                                <article className="group w-full h-full rounded-md bg-gray-100 cursor-pointer relative shadow-sm">
                                    <img
                                        alt="preview"
                                        className="img-preview w-full h-full object-cover rounded-md"
                                        src={image.url} // Usar imageUrl para asegurarte de que siempre se pasa la URL correcta
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-600 bg-gray-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(image); // Elimina usando la URL correcta
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
