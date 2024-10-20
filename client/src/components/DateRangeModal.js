import React, { useState, useRef } from 'react';
import '../css/DateRangeModal.css'; 

const DateRangeModal = ({ isOpen, onRequestClose, onSubmit }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [result, setResult] = useState(null);
    const [pay, setPay] = useState(0.0);
    const [maggioration, setMaggioration] = useState(0.0);
    const [holidays, setHolidays] = useState([]);
    const resultRef = useRef(null);  // Ref per il risultato

    if (!isOpen) {
        return null; 
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert('Per favore inserisci entrambe le date.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const { totalHours, sundayHours, weekMoney, holidayMoney } = onSubmit(start, end, holidays, pay, maggioration);
        setResult({ totalHours, sundayHours, weekMoney, holidayMoney });

        // Scorrimento automatico fino al risultato
        setTimeout(() => {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100);  // Leggero ritardo per permettere il rendering del risultato
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
                    <div className="date-range">
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
                    </div>
                    <div className="pay-info">
                        <div>
                            <label>Pay:</label>
                            <input
                                type="number"
                                value={pay}
                                onChange={(e) => setPay(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Maggioration (%):</label>
                            <input
                                type="number"
                                value={maggioration}
                                onChange={(e) => setMaggioration(e.target.value)}
                            />
                        </div>
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
                    <div className="result-container" ref={resultRef}>
                        <h3>Results:</h3>
                        <p>Total hours: {result.totalHours + result.sundayHours}h {pay !== 0 && `---> ${result.weekMoney + result.holidayMoney}€`}</p>
                        <p>Holidays hours: {result.sundayHours}h {maggioration !== 0 && `---> ${result.holidayMoney}€`}</p>
                        <p>Weekdays hours: {result.totalHours}h {pay !== 0 && `---> ${result.weekMoney}€`}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DateRangeModal;
