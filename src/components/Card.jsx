import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaHeart } from 'react-icons/fa'; // Ícono de corazón
import { useContextGlobal } from '../utils/global.context';
import Modal from './Modal';

const Card = ({ producto, isFavorite }) => {
  const { dispatch } = useContextGlobal();
  const [isModalOpen, setIsModalOpen] = useState(false);

   // Función para alternar entre agregar y quitar de favoritos
   const toggleFavorite = (e) => {
    e.stopPropagation(); // Previene que el click se propague y active el modal

    if (isFavorite) {
      // Si ya es favorito, eliminarlo de favoritos
      dispatch({ type: "REMOVE_FROM_FAVORITES", payload: producto });
    } else {
      // Si no es favorito, agregarlo a favoritos
      dispatch({ type: "ADD_TO_FAVORITES", payload: producto });
    }
  };

  // Verificar que 'producto' exista
  if (!producto || !producto.nombre || !producto.movimientoArtistico) {
    return (
      <div className="relative overflow-hidden h-100 rounded-xl bg-white/10 backdrop-blur-sm border-dashed border-2 border-white-200 opacity-40">
        <div className="h-full w-full flex flex-col align-center justify-center text-center text-white">
          Obra no disponible 😔
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="group relative w-full hover:cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-0" />

        <div className="relative overflow-hidden h-100 rounded-xl bg-white/10 backdrop-blur-sm">
          <div className="relative">
            <img
              className="h-48 w-full object-cover"
              src={producto.img}
              alt={producto.nombre}
              loading="lazy"
            />

            {/* Botón de favoritos */}
          <button
            className={`absolute top-2 right-2 text-white p-2 rounded-full ${
              isFavorite ? 'bg-red-500' : 'bg-gray-500'
            } hover:opacity-80 transition-opacity`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <FaHeart size={20} color={isFavorite ? 'white' : 'black'} />
          </button>
          </div>

          <div className="p-4 bg-white flex flex-col h-48">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {producto.nombre}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {producto.descripcion}
            </p>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-primary">
                ${producto.precioRenta}
              </span>
              <span className="bg-amber-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                {producto.tamano}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-amber-50 text-black px-3 py-1 rounded-full text-xs font-medium">
                {producto.tecnicaObra.nombre}
              </span>
              <span className="bg-amber-50 text-black px-3 py-1 rounded-full text-xs font-medium">
                {producto.movimientoArtistico.nombre}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="font-medium">{producto.artista.nombre}</span>
              <span>{producto.fechaCreacion}</span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        producto={producto}
      />
    </>
  );
};

// Definición de `propTypes`
Card.propTypes = {
  producto: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    precioRenta: PropTypes.number.isRequired,
    tamano: PropTypes.string.isRequired,
    tecnicaObra: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }).isRequired,
    movimientoArtistico: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }).isRequired,
    artista: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
    }).isRequired,
    fechaCreacion: PropTypes.string.isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool,
};

// Definición de `defaultProps`
Card.defaultProps = {
  isFavorite: false,
};

export default Card;
