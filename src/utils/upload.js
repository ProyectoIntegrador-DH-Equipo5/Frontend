import axios from 'axios';

export const uploadToCloudinary = async (file) => {
    const cloudName = "dr1jbzn9r"; // Your Cloudinary cloud name
    const uploadPreset = "ml_default"; // Your Cloudinary upload preset

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
        return null; // Return null if upload fails
    }
};
