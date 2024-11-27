import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import { useContextGlobal } from "../utils/global.context";
import reservas from "../utils/reserva.json";
import "../styles/App.css";
import "../styles/default.css";
import "../styles/styles.css";

const CalendarioModal = ({ obra, setSelectedDates }) => {
  const { isMobile } = useContextGlobal();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [disabledDates, setDisabledDates] = useState([]);

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
    setDateRange([ranges.selection]);
    setSelectedDates(ranges.selection);
  };

  const isDateDisabled = (date) => {
    return disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="relative w-full">
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
                isDisabled ? "disabled-date" : "available-date"
              }`}
              style={{
                backgroundColor: isDisabled ? "#ff000033" : "#00ff0033",
                color: isDisabled ? "#888" : "inherit",
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
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
