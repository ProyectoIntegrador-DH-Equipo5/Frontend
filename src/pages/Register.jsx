import { useState } from "react";
import { useContextGlobal } from "../utils/global.context.jsx";
import { useNavigate } from "react-router-dom";
import { AiFillExclamationCircle } from "react-icons/ai";
import emailjs from '@emailjs/browser';

const Register = () => {
  const { dispatch } = useContextGlobal();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasenia: "",
    confirmPassword: "",
    rol: "USER",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [emailStatus, setEmailStatus] = useState({
    sent: false,
    error: false,
    message: ''
  });

  const nameRegex = /^[a-zA-Z\s]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (nombre, value) => {
    let error = "";

    switch (nombre) {
      case "nombre":
        if (!value) {
          error = "El nombre es requerido";
        } else if (!nameRegex.test(value)) {
          error = "El nombre no es válido";
        }
        break;

      case "apellido":
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

      case "contrasenia":
        if (!value) {
          error = "La contraseña es requerida";
        }
        break;

      case "confirmPassword":
        if (value !== formData.contrasenia) {
          error = "Las contraseñas no coinciden";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [nombre]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const sendConfirmationEmail = async (userEmail, userName) => {
    try {
      const baseUrl = import.meta.env.PROD 
        ? 'URL_DE_PRODUCCION'
        : 'http://localhost:5173';
      
      const loginUrl = `${baseUrl}/login`;
      
      await emailjs.send(
        'service_g4ywxm6',  // Service ID de EmailJS
        'template_qq0x3dc', // Template ID
        {
          user_email: userEmail,
          user_name: userName,
          login_url: loginUrl,
          to_email: userEmail,
        },
        '2Pgg6a24lfS4J2fVD'   //  Public Key
      );
      setEmailStatus({
        sent: true,
        error: false,
        message: '¡Email de confirmación enviado exitosamente!'
      });
    } catch (error) {
      console.error('Error al enviar email:', error);
      setEmailStatus({
        sent: false,
        error: true,
        message: 'Error al enviar el email de confirmación'
      });
    }
  };

  const handleResendEmail = async () => {
    setEmailStatus({ sent: false, error: false, message: 'Enviando email...' });
    await sendConfirmationEmail(formData.email, `${formData.nombre} ${formData.apellido}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = Object.keys(formData).reduce((acc, field) => {
      validateField(field, formData[field]);
      if (errors[field]) acc[field] = errors[field];
      return acc;
    }, {});
    
    if (Object.keys(validationErrors).length === 0) {
      const newUser = {
        nombre: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        contrasenia: formData.contrasenia, // Guardamos la contraseña para el login
        rol: "USER",
      };

      setEmailStatus({ sent: false, error: false, message: 'Enviando email de confirmación...' });
      await sendConfirmationEmail(formData.email, `${formData.nombre} ${formData.apellido}`);
      
      dispatch({ type: "ADD_USER", payload: newUser });
      if (!emailStatus.error) {
        setErrors({});
        navigate("/");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-black">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#FDB813] mb-8">
          Registrarse
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1E1E1E] rounded-lg p-8 shadow-lg border border-[#FDB813]/20"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.nombre && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.apellido && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.apellido}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.email && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasenia"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.contrasenia}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.contrasenia && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.contrasenia}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.confirmPassword && (
                <p className="flex items-center mt-1 text-sm text-red-500">
                  <AiFillExclamationCircle className="mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FDB813] text-black font-bold rounded-lg hover:bg-[#FDB813]/90 transition-colors"
            >
              Registrarse
            </button>
          </div>
        </form>
        
        {emailStatus.message && (
          <div className={`mt-4 p-4 rounded-lg ${
            emailStatus.error 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
              : 'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            <p className="text-center">{emailStatus.message}</p>
            {emailStatus.error && (
              <div className="mt-2 text-center">
                <button
                  onClick={handleResendEmail}
                  className="text-[#FDB813] hover:text-[#FDB813]/80 underline"
                >
                  ¿No has recibido el email? Haz clic aquí para reenviar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
