import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ButtonSet from "./ButtonSet";
import { FiLogOut } from "react-icons/fi";
import { AiFillCloseSquare } from "react-icons/ai";
import { useContextGlobal } from '../utils/global.context';

const Header = () => {
  const { state, dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const menuRef = useRef(null);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT_USER" });
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('favorites');
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    // Actualiza el nombre del usuario cuando 'state.users' cambie
    if (state.loggedUser && state.loggedUser.nombre) {
      setUserName(state.loggedUser.nombre.substring(0, 2).toUpperCase());
    } else {
      setUserName("");
    }
  }, [state.loggedUser]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unifica los botones en un solo array
  const buttons = state.loggedUser
    ? [
        {
          text: userName,
          bgColor: "transparent",
          textColor: "black",
          textSize: "md",
          action: null,
          avatar: true,
        },
        {
          text: <FiLogOut size={30} className="font-bold text-primary" />,
          bgColor: "transparent",
          textColor: "black",
          textSize: "md",
          action: handleLogout,
        }
      ]
    : [
        { text: "Iniciar sesión", bgColor: "primary", textColor: "black", textSize: "sm", action: () => navigate("/login") },
        { text: "Registrarse", bgColor: "primary", textColor: "black", textSize: "sm", action: () => navigate("/register") },
      ];

  return (
    <header className="fixed top-0 z-10 flex items-center justify-between w-full h-24 p-4 border-b bg-background border-primary/50">
      <Logo size={16} />
      <div className="relative flex items-center">
        {state.loggedUser && (
          <div
            onClick={toggleMenu}
            className="flex items-center justify-center w-10 h-10 text-xl font-bold rounded-full cursor-pointer bg-primary"
          >
            {userName}
          </div>
        )}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute z-20 w-40 bg-black rounded-lg shadow-lg top-16 right-20 text-primary">
            <ul className="flex flex-col p-2">
              <li onClick={handleProfile} className="p-2 cursor-pointer hover:bg-gray-200 hover:text-black">
                Ver Perfil
              </li>
              <li onClick={handleLogout} className="flex items-center p-2 cursor-pointer hover:bg-gray-200 hover:text-black">
                <AiFillCloseSquare className="mr-2" /> Cerrar Sesión
              </li>
            </ul>
          </div>
        )}
        {/* Pasa el array de botones directamente */}
        <ButtonSet buttons={buttons} />
      </div>
    </header>
  );
};

export default Header;