import React, { useState } from "react";
import { useContextGlobal } from "../utils/global.context.jsx";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { RiArrowGoBackFill } from "react-icons/ri";

const Profile = () => {
  const { state } = useContextGlobal();
  const navigate = useNavigate();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const toggleFavorites = () => {
    setIsFavoritesOpen(!isFavoritesOpen);
  };

  return (
    <div className="min-h-screen bg-black p-8 profile">
      <div className="flex justify-around mx-auto items-center align center mt-20">
      <h1 className="text-4xl font-bold text-[#FDB813] text-center mb-12 pl-4 pt-12">
        Perfil
      </h1>
      <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary rounded-lg text-black hover:bg-primary/90 transition-colors text-sm sm:text-base" onClick={() => navigate("/")}>
        <RiArrowGoBackFill size={20} />
        <span>Regresar</span>
      </button>
      </div>
      {state.users ? (
        <div className="max-w-3xl mx-auto bg-black text-white">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-600 mb-1">
                    Nombre
                  </h2>
                  <p className="text-gray-800">{state.loggedUser.nombre}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-600 mb-1">
                    Email
                  </h2>
                  <p className="text-gray-800">{state.loggedUser.email}</p>
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
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {state.loggedUser.rol}
                </h2>
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
                <button
                  onClick={() => navigate("/administracion")}
                  className={`w-full mt-4 py-2 font-semibold rounded-lg transition-colors ${
                    state.loggedUser.rol === "ADMIN"
                      ? "bg-[#FDB813] text-black hover:bg-[#FDB813]/90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={state.loggedUser.rol !== "ADMIN"}
                >
                  Administrar obras
                </button>
              </div>
            </div>

            {/* Menú desplegable de favoritos: */}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-600 mb-1">
                Favoritos
              </h2>
              <button onClick={toggleFavorites} className="text-gray-400">
                {isFavoritesOpen ? (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12l-4-4h8l-4 4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 8l4 4H6l4-4z" />
                  </svg>
                )}
              </button>
            </div>

            {isFavoritesOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.favorites.map((producto) => (
                  <Card
                    key={producto.id}
                    producto={producto}
                    isFavorite={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-white">No hay usuario logueado.</div>
      )}
    </div>
  );
};

export default Profile;
