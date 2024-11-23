import Button from './Button';
import Calendar from './Calendar';
import { BiSearchAlt } from "react-icons/bi";
import '../styles/App.css';
import { useContextGlobal } from '../utils/global.context'; // Importar el contexto
import { useState } from 'react';
import Card from './Card'; // Asegúrate de importar Card

const Buscador = () => {
  const { state } = useContextGlobal(); // Obtener el estado del contexto
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedArtworks, setSelectedArtworks] = useState([]); // Estado para las obras seleccionadas
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
    ...state.categories.map(category => ({ label: category.nombre, type: translations.category })), // Mapeo de categorías
    ...state.data.map(art => ({ label: art.nombre, type: translations.art })), // Mapeo de obras
  ];

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // Filtrar opciones basadas en el valor del input y el rango de fechas
    const filtered = options.filter(option => 
      option.label.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option) => {
    setInputValue(option.label);
    setFilteredOptions([]); // Limpiar las opciones filtradas
    const selectedArtwork = state.data.find(art => art.nombre === option.label);
    if (selectedArtwork) {
        setSelectedArtworks(prev => [...prev, selectedArtwork]); // Agregar la obra seleccionada al estado
    }
  setSelectedArtworks([selectedArtwork]); // Resetea el estado de selectedArtworks con la nueva obra seleccionada
  };

  const handleSearch = (event) => {
    event.preventDefault(); // Evita la recarga de la página

    // Filtrar las obras basadas en el input y la disponibilidad
    const results = state.data.filter(option => 
      (option.nombre.toLowerCase().includes(inputValue.toLowerCase()) || 
      option.categoria?.toLowerCase().includes(inputValue.toLowerCase())) 
    );

    setSelectedArtworks(results); // Actualiza las obras seleccionadas
  };

  return (
    <section className="mx-auto bg-secondary p-7 pt-32 flex-col justify-center items-center text-center w-full search-section">
      <h1 className="text-primary font-serif text-4xl mt-16 leading-relaxed">ARTE EXCLUSIVO<br /> EXPERIENCIAS INOLVIDABLES</h1>
      {/* <div className="mx-auto flex justify-between">
        <h2 className="text-2xl mb-2 text-white text-left pt-16 px-4 md:pt-16">Busca y alquila tus obras favoritas</h2>
      </div> */}
      <form action="" className="flex flex-col md:flex-row justify-center gap-6 p-5 px-4 md:px-24 items-center">
        <div className="relative w-full max-w-md">
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
        <Calendar setDateRange={setDateRange} />
        <Button 
        text={<BiSearchAlt />} 
        bgColor="primary" 
        textColor="black" 
        textSize="2xl" 
        widthSize="16" 
        heightSize="12"
        onClick={handleSearch} />
      </form>
      
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
