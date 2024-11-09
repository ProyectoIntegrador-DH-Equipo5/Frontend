import { useState } from "react";
import { useContextGlobal } from '../utils/global.context.jsx';

const Register = () => {
  const { dispatch } = useContextGlobal();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const nameRegex = /^[a-zA-Z\s]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value) {
          error = "El nombre es requerido";
        } else if (!nameRegex.test(value)) {
          error = "El nombre no es válido";
        }
        break;

      case "lastName":
        if (!value) {
          error = "El apellido es requerido";
        } else if (!nameRegex.test(value)) {
          error = "El apellido no es válido";
        }
        break;

      case "email":
        if (!value) {
          error = "El email es requerido";
        } else if (!emailRegex.test(value)) {
          error = "El email no es válido";
        }
        break;

      case "password":
        if (!value) {
          error = "La contraseña es requerida";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          error = "Las contraseñas no coinciden";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = Object.keys(formData).reduce((acc, field) => {
      validateField(field, formData[field]);
      if (errors[field]) acc[field] = errors[field];
      return acc;
    }, {});
    if (Object.keys(validationErrors).length === 0) {
      const newUser = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      };
      dispatch({ type: 'SET_USER', payload: newUser });
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex flex-col w-full pt-32 min-h-screen bg-black">
      <h1 className="text-3xl font-bold text-center text-white mt-8 mb-8">Registrarse</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-700">Nombre:</span>
          <input
            type="text"
            name="firstName"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
        </label>
        
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-700">Apellido:</span>
          <input
            type="text"
            name="lastName"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </label>
        
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-700">Email:</span>
          <input
            type="email"
            name="email"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </label>
        
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-700">Contraseña:</span>
          <input
            type="password"
            name="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </label>
        
        <label className="mb-4">
          <span className="block text-sm font-medium text-gray-700">Confirmar Contraseña:</span>
          <input
            type="password"
            name="confirmPassword"
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
        </label>
        
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-primary text-black font-semibold rounded-lg"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register
