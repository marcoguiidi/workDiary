import React, { useState } from 'react';
import '../css/DateRangeModal.css'; 

const DateRangeModal = ({ isOpen, onRequestClose, onSubmit }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [result, setResult] = useState(null);
    const [holidays, setHolidays] = useState([]);

    if (!isOpen) {
        return null; 
    }

    // useEffect(() => {
    //     setStartDate('');
    //     setEndDate('');
    //     setResult(null);
    //     setHolidays([]);
    // }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert('Per favore inserisci entrambe le date.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const { totalHours, sundayHours } = onSubmit(start, end, holidays);
        setResult({ totalHours, sundayHours });
    };

    const handleHolidayChange = (e, index) => {
        const updatedHolidays = [...holidays];
        updatedHolidays[index] = new Date(e.target.value);
        setHolidays(updatedHolidays);
    };

    const addHolidayField = () => {
        setHolidays([...holidays, '']);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Select interval</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>From:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>To:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Holidays:</label>
                        {holidays.map((holiday, index) => (
                            <input
                                key={index}
                                type="date"
                                value={holiday ? holiday.toISOString().split('T')[0] : ''}
                                onChange={(e) => handleHolidayChange(e, index)}
                            />
                        ))}
                        <button type="button" onClick={addHolidayField}>
                            Add holiday
                        </button>
                    </div>
                    <button type="submit">Calculate</button>
                    <button type="button" onClick={onRequestClose}>Close</button>
                </form>

                {result && (
                    <div className="result-container">
                        <h3>Results:</h3>
                        <p>Total hours: {result.totalHours +result.sundayHours}h</p>
                        <p>Holidays hours: {result.sundayHours}h</p>
                        <p>Weekdays hours: {result.totalHours}h</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateRangeModal;
