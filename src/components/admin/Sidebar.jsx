import { useContextGlobal } from "../../utils/global.context";  // Importamos el contexto
import { AiFillPicture } from "react-icons/ai";
import { ImUsers } from "react-icons/im";
import { MdCategory } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";


const Sidebar = () => {
  const { dispatch } = useContextGlobal();

  const handleSectionChange = (section) => {
    console.log("Cambiando a la sección aside: ", section);
    dispatch({ type: "SET_ACTIVE_SECTION", payload: section });
  };

  return (
    <aside id="sidebar-nav" className="bg-black transition-width duration-300 w-16 hover:w-48 flex flex-col justify-between border-primary/50 pt-28">
      <div className="mt-10 mb-10">
        <ul className="sidebar-list flex flex-col gap-8 w-full pl-4">
          <li className="py-2 w-full">
            <a onClick={() => handleSectionChange("obras")}>
              <span className="text-white text-sm flex items-center gap-4">
                <AiFillPicture className="text-lg" />
                <h3 className="hidden sidebar-text">Obras</h3>
              </span>
            </a>
          </li>
          
          <li className="py-2 w-full">
            <a onClick={() => handleSectionChange("categorias")}>
              <span className="text-white text-sm flex items-center gap-4">
                <MdCategory />
                <h3 className="hidden sidebar-text">Categorías</h3>
              </span>
            </a>
          </li>
          <li className="py-2 w-full">
            <a onClick={() => handleSectionChange("usuarios")}>
              <span className="text-white text-sm flex items-center gap-4">
                <ImUsers />
                <h3 className="hidden sidebar-text">Usuarios</h3>
              </span>
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar-logout flex flex-col items-start pl-4 pb-8">
        <a href="#">
          <span className="text-white text-lg flex items-center gap-4">
            <FaPowerOff />
            <h3 className="hidden sidebar-text">Salir</h3>
          </span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
