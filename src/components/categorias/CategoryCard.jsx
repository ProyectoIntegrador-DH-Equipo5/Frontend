import PropTypes from 'prop-types';
const CategoryCard = ({ categoria }) => {

  // Validar que los datos nombre, url y categoria son requeridos para evitar errores
  CategoryCard.propTypes = {
    categoria: PropTypes.shape({
      nombre: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <div className="group relative h-48 w-full max-w-sm transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative h-full overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/20">
        <div className="h-full">
          <img 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
            src={categoria.url} 
            alt={categoria.nombre}
            loading="lazy"
          />
        </div>
        
        <div className="absolute bottom-0 w-full transform bg-white/10 p-4 backdrop-blur-md transition-all duration-300 group-hover:bg-black/50 hover:cursor-pointer">
          <h3 className="text-center text-2xl font-medium text-white transition-colors duration-300 group-hover:text-primary">
            {categoria.nombre}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;