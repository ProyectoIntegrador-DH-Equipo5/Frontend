import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { useContextGlobal } from "../utils/global.context";
import reservas from "../utils/reserva.json";
import "../styles/App.css";
import "../styles/default.css";
import "../styles/styles.css";

const CalendarioModal = ({ obra, setSelectedDates, onDateValidation }) => {
  const { isMobile } = useContextGlobal();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [disabledDates, setDisabledDates] = useState([]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Obtener las fechas reservadas para la obra específica
    const reservasObra = reservas.filter(
      (reserva) => reserva.obra.id === obra.id
    );

    const fechasDeshabilitadas = reservasObra.flatMap((reserva) => {
      const fechaInicio = new Date(reserva.fechaInicio);
      const fechaFin = new Date(reserva.fechaFin);

      const diasReservados = [];
      let currentDate = new Date(fechaInicio);

      while (currentDate <= fechaFin) {
        diasReservados.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return diasReservados;
    });

    setDisabledDates(fechasDeshabilitadas);
  }, [obra.id]);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    
    // Validación de fechas
    const validationResult = validateDateRange(startDate, endDate);
    
    if (validationResult.isValid) {
      setDateRange([ranges.selection]);
      setSelectedDates(ranges.selection);
      setValidationError("");
      
      // Llamar a la función de validación externa si existe
      if (onDateValidation) {
        onDateValidation(true);
      }
    } else {
      setValidationError(validationResult.error);
      
      // Llamar a la función de validación externa si existe
      if (onDateValidation) {
        onDateValidation(false);
      }
    }
  };

  const validateDateRange = (startDate, endDate) => {
    // Validación 1: Fechas no pueden estar en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return {
        isValid: false,
        error: "La fecha de inicio no puede ser en el pasado"
      };
    }

    // Validación 2: Rango mínimo de alquiler (por ejemplo, 7 días)
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.ceil((endDate - startDate) / millisecondsPerDay);

    if (daysDifference < 7) {
      return {
        isValid: false,
        error: "El alquiler mínimo es de 7 días"
      };
    }

    // Validación 3: Verificar que no haya fechas reservadas en el rango seleccionado
    const hasReservedDates = disabledDates.some(
      (disabledDate) => 
        disabledDate >= startDate && 
        disabledDate <= endDate
    );

    if (hasReservedDates) {
      return {
        isValid: false,
        error: "Algunas fechas seleccionadas ya están reservadas"
      };
    }

    return { isValid: true, error: "" };
  };

  const isDateDisabled = (date) => {
    return disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="relative w-full">
      {validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{validationError}</span>
        </div>
      )}
      
      <DateRangePicker
        ranges={dateRange}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        months={2}
        direction={isMobile ? "vertical" : "horizontal"}
        staticRanges={[]}
        inputRanges={[]}
        showDateDisplay={true}
        minDate={new Date()}
        disabledDates={disabledDates}
        dayContentRenderer={(date) => {
          const isDisabled = isDateDisabled(date);
          return (
            <div
              className={`calendar-day ${
                isDisabled ? "calendar-day-disabled" : "calendar-day-available"
              }`}
            >
              {date.getDate()}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CalendarioModal;
