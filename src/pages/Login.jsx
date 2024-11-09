import { useState } from 'react';
import { useContextGlobal } from '../utils/global.context.jsx';
import { useNavigate } from 'react-router-dom';
import { AiFillExclamationCircle } from "react-icons/ai";

const Login = () => {
  const { dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mockUser = { email: 'admin@artxp.com', password: 'admin', name: 'Admin' };

    if (email === mockUser.email && password === mockUser.password) {
      dispatch({ type: 'SET_USER', payload: mockUser });
      setError('');
      navigate('/');
    } else {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex flex-col w-full pt-32 min-h-screen bg-black">
      <h1 className="text-3xl font-bold text-center text-white mt-8 mb-8">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md mx-auto bg-white py-16 p-8 rounded-lg shadow-md">
        <label className="mb-4">
          <span className="block text-lg font-medium text-gray-700">Email:</span>
          <input 
            type="email" 
            className="w-96 mt-1 p-2 border border-gray-300 rounded-lg" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </label>
        <label className="mb-4">
          <span className="block text-lg font-medium text-gray-700">Contraseña:</span>
          <input 
            type="password" 
            className="w-96 mt-1 p-2 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-red-500 font-bold"><AiFillExclamationCircle />{error}</p>}
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