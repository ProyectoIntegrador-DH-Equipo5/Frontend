import { useState, useEffect } from 'react';
import { DateRangePicker } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../styles/App.css'

const Calendar = ({ setDateRange }) => {
  const [dateRange, setLocalDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [showCalendar, setShowCalendar] = useState(false); // Estado para controlar visibilidad

  useEffect(() => {
    const handleClickOutside = (event) => {
      const calendarElement = document.getElementById('calendar'); // Asignar un ID al contenedor del calendario
      if (calendarElement && !calendarElement.contains(event.target)) {
        setShowCalendar(false); // Cerrar el calendario
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <div className="relative" id="calendar">
      <div
        className="border p-3 rounded-lg cursor-pointer text-gray-700 bg-gray-50 shadow-md hover:shadow-lg transition"
        onClick={() => setShowCalendar(!showCalendar)}>
        
        <span>
          {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
        </span>
      </div>

      {showCalendar && (
        <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          {/* <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowCalendar(false)}
          >
            &times;
          </button> */}

          <DateRangePicker
            ranges={dateRange}
            onChange={(ranges) => {
              setDateRange([ranges.selection]);
              setLocalDateRange([ranges.selection]);
            }}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            staticRanges={[]}
            inputRanges={[]}
            showDateDisplay={true}
            minDate={new Date()}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;