import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContextGlobal } from "../../utils/global.context";


const ImageUpload = ({ onFilesAdded, existingImage, artId }) => {
    const { dispatch } = useContextGlobal(); 
    const cloudName = "dr1jbzn9r"; // Your Cloudinary cloud name
    const uploadPreset = "ml_default"; // Your Cloudinary upload preset

    // Fetch images directly from global state (no local component state)
    const { images } = useContextGlobal().state; 

    // Function to upload to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("cloud_name", cloudName);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            );
            return response.data.secure_url; // Return the URL of the uploaded image
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // Function to add a file and upload to Cloudinary
    const addFile = async (file) => {
        const imageUrl = await uploadToCloudinary(file);
        if (imageUrl) {
            // Ensure the image is not already in the list to avoid duplicates
            if (!images.includes(imageUrl)) {
                // Dispatch action to add the image to the global state
                dispatch({
                    type: "ADD_IMAGE",
                    payload: imageUrl,
                });
                // Also update the artwork with the image
                dispatch({
                    type: "ADD_IMAGE_TO_ART",
                    payload: { artId, imgUrl: imageUrl }, // Pass the artId and image URL
                });
                onFilesAdded(imageUrl); // Pass the URL to parent component
            }
        }
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
        dispatch({
            type: "DELETE_IMAGE",
            payload: { id: url },
        });
    };

    useEffect(() => {
        if (existingImage) {
            const objectURL = URL.createObjectURL(existingImage);
            // Check if image already exists before adding
            if (!images.includes(objectURL)) {
                dispatch({
                    type: "ADD_IMAGE",
                    payload: objectURL,
                });
            }
        }
    }, [existingImage, images, dispatch]);

    return (
        <div
            className="mt-4 border-2 border-dashed border-gray-400 py-12 flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} // Prevent default behavior
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
        >
            <p className="mb-3 font-semibold text-gray-900">Arrastra y suelta tus archivos aquí o</p>
            <input
                id="hidden-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                onClick={(e) => e.stopPropagation()} // Prevent click propagation
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
                                    src={url} // Show the uploaded image URL
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
