import { useState, useEffect } from 'react';
import { useContextGlobal } from '../utils/global.context.jsx';
import { useNavigate } from 'react-router-dom';
import { AiFillExclamationCircle } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import axiosConfig from "../api/axiosConfig.js";

const Login = () => {
  const { dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = () => {
    if (!emailRegex.test(email)) {
      setError("El formato del email no es válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;
  
    try {
      const response = await axiosConfig.post('/api/auth/login', { email, password });
      const { token } = response.data;

      if (response.status === 200) {
        const user = jwtDecode(token); // Decodifica el token para obtener los datos del usuario
        console.log("Token decodificado:", user);

        localStorage.setItem('loggedUser', JSON.stringify(user)); //Almacenamos tanto el usuario como el token en el mismo objeto
        localStorage.setItem('token', token);
        
        dispatch({type: 'LOGIN_USER', payload: user});  // Establecer el usuario en el contexto global
        setError('');  // Limpiar el error
        navigate('/');  // Redirigir al usuario a la página principal
      } else {
        setError(response.data.message || 'Email o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Hubo un error en el servidor. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser');
    console.log(storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Dispatch para cargar el usuario desde el localStorage al contexto global
        dispatch({ type: 'LOGIN_USER', payload: userData });
        navigate('/');  // Redirigir al usuario a la página principal
      } catch (err) {
        console.error("Error al parsear el usuario desde localStorage:", err);
      }
    }
  }, [dispatch, navigate]);


  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser');
    console.log(storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Dispatch para cargar el usuario desde el localStorage al contexto global
        dispatch({ type: 'LOGIN_USER', payload: userData });
        navigate('/');  // Redirigir al usuario a la página principal
      } catch (err) {
        console.error("Error al parsear el usuario desde localStorage:", err);
      }
    }
  }, [dispatch, navigate]);


  return (
    <div className="flex flex-col w-full pt-32 min-h-screen bg-black">
      <h1 className="text-3xl font-bold text-center text-white mt-8 mb-8">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto bg-white py-16 p-8 rounded-lg shadow-md">
        <label className="mb-4">
          <span className="block text-lg font-medium text-gray-700">Email:</span>
          <input 
            type="email" 
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            onBlur={validateEmail}
            required
          />
        </label>
        <label className="mb-4">
          <span className="block text-lg font-medium text-gray-700">Contraseña:</span>
          <input 
            type="password" 
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && (
          <p className="flex items-center text-red-500 font-bold">
            <AiFillExclamationCircle className="mr-2" />{error}
          </p>
        )}
        <button 
          type="submit"
          className="w-full py-2 mt-4 bg-primary text-black font-semibold rounded-lg"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login