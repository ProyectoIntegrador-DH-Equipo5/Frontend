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
      <div className="fixed inset-0 z-40 flex items-center justify-center lg:px-96">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Header negro */}
        <div className="relative w-full max-w-[1200px] mx-4">
          <div className="bg-black text-white p-4 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {producto.nombre}
                </h2>
                <p className="text-primary italic">
                  {producto.artista?.nombre}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-black hover:bg-primary transition-colors"
              >
                <RiArrowGoBackFill size={20} />
                <span>Regresar</span>
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-white rounded-b-xl p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Columna izquierda: Imagen principal */}
              <div className="flex-1">
                <img
                  src={producto.img}
                  alt={producto.nombre}
                  className="w-full aspect-[4/3] object-cover rounded-lg mb-6"
                />

                {/* Categorías */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg w-48 h-14 text-md justify-center border-gray-400 border-2">
                    <BsRulers className="text-2xl" />
                    <span>{producto.tamano}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg w-48 h-14 text-md justify-center border-gray-400 border-2">
                    <BsPalette className="text-2xl" />
                    <span>{producto.tecnicaObra?.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg w-48 h-14 text-md justify-center border-gray-400 border-2">
                    <BsPerson className="text-2xl" />
                    <span>{producto.movimientoArtistico?.nombre}</span>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de creación:</p>
                    <p>{producto.fechaCreacion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Descripción:</p>
                    <p className="text-sm">{producto.descripcion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dimensiones:</p>
                    <p>{producto.tamano}</p>
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
                      <span className="text-white font-semibold">Ver más</span>
                    </div>
                  </div>
                </div>

                {state.users ? (
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
                    <p className="text-red-500 text-sm text-center mb-3">
                      Debe estar autenticado para alquilar una obra
                    </p>
                  </>
                )}

                <p className="text-2xl font-bold text-center">
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