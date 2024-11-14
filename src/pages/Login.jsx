import { useState } from "react";
import { useContextGlobal } from "../utils/global.context.jsx";
import { useNavigate } from "react-router-dom";
import { AiFillExclamationCircle } from "react-icons/ai";

const Login = () => {
  const { state, dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = () => {
    if (!emailRegex.test(email)) {
      setError("El formato del email no es válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    const allUsers = state.users;
    console.log(allUsers);

    allUsers.filter((user) => {
      if (user.email === email && user.contrasenia === contrasenia) {
        console.log(user);
        dispatch({ type: "LOGIN_USER", payload: user });
        navigate("/");
      } else {
        setError("Email o contraseña incorrectos.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-[#FDB813] mb-8">
          Iniciar sesión
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1E1E1E] rounded-lg p-8 shadow-lg border border-[#FDB813]/20"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                E-mail
              </label>
              <input
                type="email"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                required
              />
            </div>
            <div>
              <label className="block text-[#FDB813] text-lg mb-2">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full p-3 bg-white rounded-lg border-2 border-[#FDB813]/20 focus:border-[#FDB813] outline-none transition-colors"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="flex items-center text-red-500 font-medium">
                <AiFillExclamationCircle className="mr-2" />
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-[#FDB813] text-black font-bold rounded-lg hover:bg-[#FDB813]/90 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login