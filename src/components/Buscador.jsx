import Button from './Button';
import Calendar from './Calendar';
import { BiSearchAlt } from "react-icons/bi";
import '../styles/App.css';
import { useContextGlobal } from '../utils/global.context';
import { useState } from 'react';
import Card from './Card';
import reservas from '../utils/reserva.json';

const Buscador = () => {
  const { state } = useContextGlobal();
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  // Cambia los nombres de categoria y obra para mejorar legibilidad.
  const translations = {
    category: 'categoría',
    art: 'obra',
  };
  
  // Mapeo de obras y categorias en el autocompletado
  const options = [
    // Mapeo de categorías
    ...state.categories.map(category => ({ 
      label: category.nombre, 
      type: translations.category,
      id: category.id 
    })),
    // Mapeo de obras
    ...state.data.map(art => ({ 
      label: art.nombre, 
      type: translations.art,
      id: art.id
    })),
  ];
  

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = options.filter(option => 
      option.label.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option) => {
    setInputValue(option.label);
    setFilteredOptions([]);
  };

  const filterByAvailability = (artworks) => {
    return artworks.filter(art => {
      return !reservas.some(reserva => {
        const fechaInicio = new Date(reserva.fechaInicio);
        const fechaFin = new Date(reserva.fechaFin);
        return art.id === reserva.obra.id && 
              ((dateRange[0].startDate >= fechaInicio && dateRange[0].startDate <= fechaFin) ||
                (dateRange[0].endDate >= fechaInicio && dateRange[0].endDate <= fechaFin) ||
                (dateRange[0].startDate <= fechaInicio && dateRange[0].endDate >= fechaFin));
      });
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    
    // Primero verificamos si el input coincide exactamente con una categoría
    const selectedCategory = state.categories.find(
      category => category.nombre.toLowerCase() === inputValue.toLowerCase()
    );

    let results = [];
    
    if (selectedCategory) {
      // Si es una categoría exacta, mostramos todas las obras de esa categoría
      results = state.data.filter(art => 
        art.movimientoArtistico.id === selectedCategory.id
      );
    } else {
      // Si no es una categoría exacta, buscamos coincidencias parciales en obras y categorías
      results = state.data.filter(art => 
        art.nombre.toLowerCase().includes(inputValue.toLowerCase()) || 
        art.movimientoArtistico.nombre.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    // Aplicamos el filtro de disponibilidad
    const availableResults = filterByAvailability(results);
    setSelectedArtworks(availableResults);
  };

  return (
    <section className="mx-auto bg-secondary p-7 pt-32 flex-col justify-center items-center text-center w-full search-section">
      <h1 className="text-primary font-serif text-4xl mt-16 leading-relaxed">ARTE EXCLUSIVO<br /> EXPERIENCIAS INOLVIDABLES</h1>
      <div className="mx-auto flex justify-between w-full">
      <form onSubmit={handleSearch} className="flex flex-col w-full md:flex-row justify-center gap-6 p-5 px-4 md:px-24 sm:items-start md:items-start lg:items-center">
        <div className="relative w-full max-w-md">
        <h2 className="text-2xl mb-2 text-white text-left pt-16 px-4 md:pt-16">Busca y alquila tus obras favoritas</h2>
          <input
            type="text"
            placeholder="Encuentra tu obra favorita"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 h-12 pl-10 pr-4 text-gray-700 placeholder-gray-500 focus:outline-none"
          />
          {filteredOptions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg opacity-70 w-full max-h-60 overflow-y-auto shadow-lg">
              {filteredOptions.map((option, index) => (
                <li 
                  key={index} 
                  onClick={() => handleOptionClick(option)} 
                  className="cursor-pointer hover:bg-gray-200 p-2 text-left"
                >
                  {option.label} ({option.type.charAt(0).toUpperCase() + option.type.slice(1)})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl mb-2 text-white text-left pt-16 px-4 md:pt-16">Rango de Fecha</h2>
          <Calendar setDateRange={setDateRange}/>
        </div>
        <div className="flex flex-col justify-self-end">
        <h2 className="mb-10 pt-16 md:pt-16"></h2>
          <Button 
          type="button"
          text={<BiSearchAlt /> } 
          bgColor="primary" 
          textColor="black" 
          textSize="2xl" 
          widthSize="16" 
          heightSize="12"
          onClick={handleSearch}
          />
        </div>
      </form>
      </div>
      
      {/* Renderizar las obras seleccionadas */}
      <div className="mt-8">
        <h2 className="text-3xl text-primary text-left mb-4">Obras Seleccionadas</h2>
        {selectedArtworks.length > 0 ? (
          <div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedArtworks.map((producto) => (
              <Card key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-secondary">No hay obras seleccionadas.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Buscador;
