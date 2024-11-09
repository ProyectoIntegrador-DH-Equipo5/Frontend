import React, { useState } from 'react';
import { AiOutlineArrowLeft, AiFillPicture } from "react-icons/ai";
import { useContextGlobal } from '../utils/global.context.jsx';

const Modal = ({ isOpen, onClose, producto }) => {
  const [mostrarMas, setMostrarMas] = useState(false);
  const { state } = useContextGlobal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-6xl max-h-[96vh] overflow-y-auto bg-white rounded-xl mx-4 shadow-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/20">
        <button
          onClick={onClose}
          className="absolute top-8 right-4 p-4 rounded-full bg-gray-600 z-10 hover:bg-primary"
        >
          <AiOutlineArrowLeft className="w-8 h-8 font-bold text-primary hover:text-black" />
        </button>

        <div>
          <header className="pt-8 px-8 bg-black text-white w-full">
            <h2 className="text-4xl font-bold mb-2">{producto.nombre}</h2>
            <p className="text-xl text-gray-400">{producto.artista.nombre}</p>
          </header>
          <div className="flex flex-col py-4 px-8 bg-black lg:flex-row gap-6">
            <div className="flex flex-col p-6 rounded-xl bg-white w-full lg:flex-row gap-6">
              {/* Imagen Principal y Detalles */}
              <div className="flex-1">
              <img
                src={producto.img}
                alt={producto.nombre}
                className="w-full aspect-[5/3] object-cover rounded-lg mb-6"
              />

              <div className="space-y-4 flex flex-col">
                <div>
                  <h3 className="text-lg font-semibold">Fecha de creación:</h3>
                  <p className="text-md text-gray-600">{producto.fechaCreacion}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Descripción:</h3>
                  <p className="text-md text-gray-600">{producto.descripcion}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Movimiento artístico / Técnica:</h3>
                  <p className="text-md text-gray-600">{producto.movimientoArtistico.nombre} / {producto.tecnicaObra.nombre}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Dimensiones:</h3>
                  <p className="text-md text-gray-600">{producto.tamano}</p>
                </div>

              </div>

              <div className="flex flex-col w-full items-end">
                <button 
                  className={`w-48 py-3 px-4 bg-amber-600 text-white text-xl rounded-lg font-medium hover:bg-amber-700 transition-colors ${!state.user ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!state.user}
                >
                  Alquilar
                </button>
              </div>
              </div>

              {/* Imágenes Adicionales y precio */}
              <div className="lg:w-1/3">
                <div className="sticky top-4">
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {producto.imagenesAdicionales?.length > 0 ? (
                      (mostrarMas ? producto.imagenesAdicionales : producto.imagenesAdicionales.slice(0, 4)).map((imagen, index) => (
                        <img
                          key={index}
                          src={imagen}
                          alt={`Vista ${index + 1} de ${producto.nombre}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      ))
                    ) : (
                      <div className="flex p-2 items-center justify-center text-gray-600 mx-auto">
                        <AiFillPicture className="w-32 h-32" />
                        <p className="text-xl pl-2">Sin imagenes disponibles 😔</p>
                      </div>
                    )}
                  </div>
                  <button 
                    className="w-full py-3 px-4 bg-amber-600 text-white text-xl rounded-lg font-medium hover:bg-amber-700 transition-colors"
                    onClick={() => setMostrarMas(!mostrarMas)}
                  >
                    {mostrarMas ? 'Ver menos' : 'Ver más'}
                  </button>
                  <p className="text-xl font-bold text-secondary text-right py-4 px-2">Desde ${producto.precioRenta} / día*</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;