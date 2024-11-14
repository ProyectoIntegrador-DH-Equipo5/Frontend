import React from 'react';
import { useContextGlobal } from '../utils/global.context.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { state } = useContextGlobal();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full pt-32 mx-auto min-h-screen bg-black">
      <h1 className="text-3xl font-bold text-center text-white mt-8 mb-8">Perfil de Usuario</h1>
      {state.users ? (
        <div className="text-white text-left mx-auto">
          <p><span className="font-bold text-xl">Nombre:</span> {state.loggedUser.nombre}</p>
          <p><span className="font-bold text-xl">Email:</span> {state.loggedUser.email}</p>
          <button 
            onClick={() => navigate('/administracion')}
            className={`mt-4 py-2 px-4 font-bold rounded-lg ${state.loggedUser.rol === 'ADMIN' ? 'bg-primary text-black' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
        disabled={state.loggedUser.rol !== 'ADMIN'}>
            Administrar obras
          </button>
        </div>
      ) : (
        <p className="text-white text-center">No hay usuario logueado.</p>
      )}
    </div>
  );
};

export default Profile;