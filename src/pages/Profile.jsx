import React from 'react';
import { useContextGlobal } from '../utils/global.context.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { state } = useContextGlobal();
  const navigate = useNavigate();
  console.log(state.loggedUser?.rol);
 // Verifica que loggedUser esté definido


  return (
    <div className="min-h-screen bg-black p-8 profile">
      <h1 className="text-4xl font-bold text-[#FDB813] mt-24 text-center mb-12 pl-4">
        Perfil
      </h1>
      console.log(state.loggedUser);

      
      {state.users ? (
        <div className="max-w-3xl mx-auto bg-black text-white">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-600 mb-1">
                    Nombre
                  </h2>
                  <p className="text-gray-800">
                    {state.loggedUser.nombre}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-600 mb-1">
                    Email
                  </h2>
                  <p className="text-gray-800">
                    {state.loggedUser.email}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-600 mb-1">
                    Preferencias
                  </h2>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    Me guuuUsta el arrrte.
                  </p>
                </div>
              </div>

              <div className="w-96 mx-auto flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{state.loggedUser?.rol[0]?.authority}</h2>
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <button 
                  onClick={() => navigate('/administracion')}
                  className={`w-full mt-4 py-2 font-semibold rounded-lg transition-colors ${
                    state.loggedUser?.rol[0]?.authority === 'ADMIN' || state.loggedUser?.rol[0]?.authority === 'COLAB'
                      ? 'bg-[#FDB813] text-black hover:bg-[#FDB813]/90' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={state.loggedUser?.rol[0]?.authority !== 'ADMIN' && state.loggedUser?.rol[0]?.authority !== 'COLAB'}
                >
                  Administrar obras
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white">
          No hay usuario logueado.
        </div>
      )}
    </div>
  );
};

export default Profile;