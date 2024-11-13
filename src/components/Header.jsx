// Header.js
import Logo from "./Logo";
import ButtonSet from "./ButtonSet";
import { useNavigate } from "react-router-dom";
import { useContextGlobal } from '../utils/global.context';
import { AiFillCloseSquare } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const { state, logoutUser } = useContextGlobal();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const menuRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
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
    if (state.users && state.users.name) {
      setUserName(state.users.name.substring(0, 2).toUpperCase());
    } else {
      setUserName("");
    }
  }, [state.users]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unifica los botones en un solo array
  const buttons = state.users
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
          text: <AiFillCloseSquare size={20} className="text-primary font-bold" />,
          bgColor: "transparent",
          textColor: "black",
          textSize: "sm",
          action: handleLogout,
        }
      ]
    : [
        { text: "Iniciar sesión", bgColor: "primary", textColor: "black", textSize: "sm", action: () => navigate("/login") },
        { text: "Registrarse", bgColor: "primary", textColor: "black", textSize: "sm", action: () => navigate("/register") },
      ];

  return (
    <header className="flex justify-between items-center fixed top-0 w-full h-24 bg-background p-4 border-b border-primary/50 z-10">
      <Logo size={16} />
      <div className="flex items-center relative">
        {state.users && (
          <div
            onClick={toggleMenu}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-xl font-bold cursor-pointer"
          >
            {userName}
          </div>
        )}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-16 right-0 w-40 bg-black text-primary rounded-lg shadow-lg z-20">
            <ul className="flex flex-col p-2">
              <li onClick={handleProfile} className="p-2 hover:bg-gray-200 hover:text-black cursor-pointer">
                Ver Perfil
              </li>
              <li onClick={handleLogout} className="p-2 hover:bg-gray-200 hover:text-black cursor-pointer flex items-center">
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