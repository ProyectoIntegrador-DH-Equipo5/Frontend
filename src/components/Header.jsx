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
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttons = {
    1: state.user
      ? [
          {
            text: "",
            bgColor: "transparent",
            textColor: "black",
            textSize: "sm",
            action: null,
            avatar: state.user.name ? state.user.name.substring(0, 2).toUpperCase() : "",
          },
        ]
      : [
          { text: "Iniciar sesión", bgColor: "primary", textColor: "black", textSize: "sm", action: () => navigate("/login") },
          { text: "Registrarse", bgColor: "primary", textColor: "black", textSize: "sm", action: () => navigate("/register") },
        ],
    2: state.user
      ? [
          {
            text: <AiFillCloseSquare size={20} className="text-primary font-bold" />,
            bgColor: "transparent",
            textColor: "black",
            textSize: "sm",
            action: handleLogout,
          },
        ]
      : [],
  };

  return (
    <header className="flex bg-background justify-between items-center fixed top-0 w-screen h-24 z-10 p-4 border-primary/50">
      <Logo size={16} />
      <div className="flex items-center">
        {state.user ? (
          <div
            onClick={toggleMenu}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-xl font-bold cursor-pointer"
          >
            {state.user.name ? state.user.name.substring(0, 2).toUpperCase() : ""}
          </div>
        ) : null}
        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-12 right-20 top-20 w-32 bg-black rounded-lg shadow-md text-primary z-10">
            <ul className="flex flex-col p-2">
              <li onClick={handleProfile} className="p-2 hover:bg-gray-200 hover:text-black cursor-pointer">
                Ver Perfil
              </li>
              <li onClick={handleLogout} className="p-2 hover:bg-gray-200 hover:text-black cursor-pointer flex items-center">
                Cerrar Sesión
              </li>
            </ul>
          </div>
        )}
        <ButtonSet buttons={buttons} />
      </div>
    </header>
  );
};

export default Header