import React, { useState } from 'react';
import { DateRangePicker } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Calendar = () => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [showCalendar, setShowCalendar] = useState(false); // Estado para controlar visibilidad

  return (
    <div
    className="border p-3 rounded-lg cursor-pointer text-gray-700 bg-gray-50"
    onClick={() => setShowCalendar(!showCalendar)}>
      
      <span>{dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}</span>
      
      {showCalendar && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>

          <DateRangePicker
            ranges={dateRange}
            onChange={(ranges) => setDateRange([ranges.selection]) }
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            staticRanges={[]}
            inputRanges={[]}
            showDateDisplay={true}
          />

          </div>
            )}
    </div>
  );
};

export default Calendar;