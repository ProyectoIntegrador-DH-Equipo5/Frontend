import { React, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { useContextGlobal } from "../utils/global.context.jsx";

const ReservaDetalle = () => {
  const { id } = useParams();
  const location = useLocation();
  const { state } = useContextGlobal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDates = location.state?.selectedDates;

  if (!state || !state.data) {
    return <div>No hay información disponible.</div>;
  }

  const producto = state.data?.find((prod) => prod.id === parseInt(id));

  if (!producto || !selectedDates) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-32 bg-gray-900 text-white">
        No hay información disponible sobre el producto o las fechas
        seleccionadas.
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Lógica para confirmar la reserva
      console.log("Reserva confirmada");
    } catch (error) {
      console.error("Error al procesar la reserva:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startDate = new Date(selectedDates.startDate);
  const endDate = new Date(selectedDates.endDate);
  const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const totalPrice = producto.precioRenta * durationInDays; // Suponiendo que el precio es por día

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-32 bg-background text-white">
      <div className="w-full max-w-6xl bg-background bg-opacity-50 rounded-lg shadow-lg p-8 flex border-primary border">
        <img
          src={producto.img}
          alt={producto.nombre}
          className="w-1/3 h-auto rounded-lg shadow-md mr-4"
        />
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-center text-[#FDB813] mb-6">
            Detalles de la Reserva
          </h1>
          <h2 className="text-4xl font-bold text-[#FDB813] mb-2">{producto.nombre}</h2>
          <p className="text-lg text-gray-300 mb-4">{producto.descripcion}</p>

          <h3 className="mt-6 text-2xl font-semibold text-[#FDB813]">Detalles de la Reserva</h3>
          <p className="text-gray-300">
            <strong>Fecha de Inicio:</strong>{" "}
            {startDate.toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            <strong>Fecha de Fin:</strong>{" "}
            {endDate.toLocaleDateString()}
          </p>
          <p className="text-gray-300">
            <strong>Duración en días:</strong> {durationInDays} días
          </p>
          <p className="text-lg font-bold text-[#FDB813]">
            <strong>Precio Total:</strong> ${totalPrice.toLocaleString()} USD
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-[#FDB813]">Información del Usuario</h3>
          <p className="text-gray-300">
            <strong>Nombre:</strong> {state.loggedUser?.nombre}
          </p>
          <p className="text-gray-300">
            <strong>Apellido:</strong> {state.loggedUser?.apellido}
          </p>
          <p className="text-gray-300">
            <strong>Correo Electrónico:</strong> {state.loggedUser?.email}
          </p>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-6 px-6 py-3 bg-[#FDB813] text-black rounded hover:bg-[#FDB813]/90 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
          </button>

          <div className="mt-6 text-center">
            <Link to="/politicas" className="text-[#FDB813] underline">
              Ver Políticas de Reserva
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaDetalle;
