import React, { useState } from "react";
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { BsRulers } from "react-icons/bs";
import { BsPalette } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { useContextGlobal } from "../utils/global.context.jsx";

const Modal = ({ isOpen, onClose, producto }) => {
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);
  const { state } = useContextGlobal();

  if (!isOpen) return null;

  const todasLasImagenes = [
    producto.img,
    ...(producto.imagenesAdicionales || []),
  ];

  const siguienteImagen = () => {
    setImagenActual((prev) =>
      prev === todasLasImagenes.length - 1 ? 0 : prev + 1
    );
  };

  const anteriorImagen = () => {
    setImagenActual((prev) =>
      prev === 0 ? todasLasImagenes.length - 1 : prev - 1
    );
  };

  const CarruselModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={() => setMostrarCarrusel(false)}
        className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
      >
        <IoMdClose size={24} />
      </button>
      <button
        onClick={anteriorImagen}
        className="absolute left-4 p-2 text-white hover:text-gray-300"
      >
        <MdNavigateBefore size={40} />
      </button>
      <button
        onClick={siguienteImagen}
        className="absolute right-4 p-2 text-white hover:text-gray-300"
      >
        <MdNavigateNext size={40} />
      </button>
      <img
        src={todasLasImagenes[imagenActual]}
        alt={`Imagen ${imagenActual + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 md:px-8 lg:px-12 sm:overflow-y-scroll">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Header negro */}
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="bg-black text-white p-4 rounded-t-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary line-clamp-1">
                  {producto.nombre}
                </h2>
                <p className="text-primary italic text-sm sm:text-base">
                  {producto.artista?.nombre}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary rounded-lg text-black hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <RiArrowGoBackFill size={20} />
                <span>Regresar</span>
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-white rounded-b-xl p-4 sm:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Columna izquierda: Imagen principal */}
              <div className="flex-1">
                <img
                  src={producto.img}
                  alt={producto.nombre}
                  className="w-full aspect-[4/3] object-cover rounded-lg mb-4 sm:mb-6"
                />

                {/* Categorías */}
                <div className="text-xl text-gray-600">Características</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm sm:text-base justify-center border-gray-400 border-2">
                    <BsRulers className="text-xl" />
                    <span className="line-clamp-1">{producto.tamano}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm sm:text-base justify-center border-gray-400 border-2">
                    <BsPalette className="text-xl" />
                    <span className="line-clamp-1">{producto.tecnicaObra?.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm sm:text-base justify-center border-gray-400 border-2">
                    <BsPerson className="text-xl" />
                    <span className="line-clamp-1">{producto.movimientoArtistico?.nombre}</span>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Fecha de creación:</p>
                    <p className="text-sm sm:text-base">{producto.fechaCreacion}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Descripción:</p>
                    <p className="text-sm sm:text-base">{producto.descripcion}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dimensiones:</p>
                    <p className="text-sm sm:text-base">{producto.tamano}</p>
                  </div>
                </div>
              </div>

              {/* Columna derecha: Miniaturas y botones */}
              <div className="lg:w-1/3">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {producto.imagenesAdicionales
                    ?.slice(0, 3)
                    .map((imagen, index) => (
                      <img
                        key={index}
                        src={imagen}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setMostrarCarrusel(true)}
                  >
                    <img
                      src={producto.imagenesAdicionales?.[3]}
                      alt="Ver más"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm sm:text-base">Ver más</span>
                    </div>
                  </div>
                </div>

                {state.loggedUser ? (
                  <button className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary transition-colors mb-3">
                    Alquilar
                  </button>
                ) : (
                  <>
                    <button
                      className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary transition-colors mb-3 opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Alquilar
                    </button>
                    <p className="text-red-500 text-xs sm:text-sm text-center mb-2 sm:mb-3">
                      Debe estar autenticado para alquilar una obra
                    </p>
                  </>
                )}

                <p className="text-xl sm:text-2xl font-bold text-center">
                  $ {producto.precioRenta?.toLocaleString()} USD
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mostrarCarrusel && <CarruselModal />}
    </>
  );
};

export default Modal