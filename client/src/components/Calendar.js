import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import EventFormModal from './EventFormModal';
import EventDetailModal from './EventDetailModal';
import DateRangeModal from './DateRangeModal';
import '../css/Calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentUser, setCurrentUser] = useState(null); 
    const [initialStart, setInitialStart] = useState(null);
    const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);

    const fetchEvents = async (selectedDate) => {

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/events', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const events = response.data.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
            }));
            setEvents(events);

        } catch (err) {
            console.error('Error fetching events:', err.response ? err.response.data : err.message);
        }
    };

    const fetchCurrentUser = async () => {

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCurrentUser(response.data.email); 

        } catch (err) {
            console.error('Error fetching current user:', err.response ? err.response.data : err.message);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchEvents();
    }, []);

    const handleSelectView = (view) => {

        setView(view);
    };

    const handleSelectSlot = (slotInfo) => {

        setSelectedEvent(null);
        setInitialStart(moment(slotInfo.start).toDate());
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {

        setModalOpen(false);
        setInitialStart(null);
        setSelectedEvent(null);
    };

    const handleOpenDateRangeModal = () => {
        setDateRangeModalOpen(true);
    };

    const handleCloseDateRangeModal = () => {
        setDateRangeModalOpen(false);
    };

    const handleCalculateWorkHours = (startDate, endDate, holidays, pay, maggioration) => {
        pay = parseFloat(pay);
        maggioration = parseFloat(maggioration);

        const filteredEvents = events.filter(event => {
            return event.start >= startDate && event.end <= endDate && event.title === 'Work';
        });
    
        let totalHours = 0;
        let sundayHours = 0;
    
        filteredEvents.forEach(event => {
            const start = moment(event.start);
            const end = moment(event.end);
            const duration = moment.duration(end.diff(start)).asHours();
    
            if (start.day() === 0 || holidays.some(holiday => moment(holiday).isSame(start, 'day'))) {
                sundayHours += duration;
            } else {
                totalHours += duration;
            }
        });


        let weekMoney = totalHours * pay;
        let supplemento = pay * maggioration/100.0;
        let payMaggiorated = pay + supplemento;
        let holidayMoney = sundayHours * payMaggiorated;
    
        weekMoney = Number(weekMoney.toFixed(2));
        holidayMoney = Number(holidayMoney.toFixed(2));

        return { totalHours, sundayHours, weekMoney, holidayMoney }; 
    };

    const handleSaveEvent = async (event) => {

        try {
            const token = localStorage.getItem('authToken');
            const eventData = {
                start: event.start,
                end: event.end,
                color: event.color,
                };

    
            if (selectedEvent && selectedEvent._id) {
                const response = await axios.put(`/api/events/${selectedEvent._id}`, eventData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

            } else {
                const response = await axios.post('/api/events', eventData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

            }
          
            fetchEvents();
            handleCloseModal();
        } catch (err) {
            console.error('Error saving event:', err.response ? err.response.data : err.message);
        }
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = event.color || '#007bff';

        const style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0',
            display: 'block'
        };

        return { style };
    };

    const handleSelectEvent = (event) => {

        setSelectedEvent(event);
        setDetailModalOpen(true);
    };

    const handleEditEvent = (event) => {

        setSelectedEvent(event);
        setModalOpen(true);
        setDetailModalOpen(false);
    };

    const handleDeleteEvent = async (eventId) => {
        const confirmDelete = window.confirm('Would you like to delete this event?');
        if (confirmDelete) {

            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(`/api/events/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                fetchEvents();
                setDetailModalOpen(false);
            } catch (err) {
                console.error('Error deleting event:', err);
            }
        }
    };

    return (
        <div className="page-content">
            <Calendar
                key={date.toISOString()} 
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                views={['month']}
                view={view}
                onView={handleSelectView}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                style={{ height: 500 }}
                eventPropGetter={eventStyleGetter}
                date={date}
                onNavigate={(newDate, view, action) => {
                    if (action === 'TODAY') {
                        setDate(currentDate);
                    } else {
                        setDate(newDate);
                    }
                }}
                components={{
                    toolbar: (toolbarProps) => (
                        <CustomToolbar
                            {...toolbarProps}
                            currentDate={currentDate}
                        />
                    ),
                }}
            />

            <button onClick={handleOpenDateRangeModal}>Calcola ore di lavoro</button>

            <EventFormModal
                isOpen={modalOpen}
                onRequestClose={handleCloseModal}
                onSave={handleSaveEvent}
                event={selectedEvent}
                initialStart={initialStart}
            />
            <EventDetailModal
                isOpen={detailModalOpen}
                onRequestClose={() => setDetailModalOpen(false)}
                event={selectedEvent}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                currentUser={currentUser}
            />
            <DateRangeModal
                isOpen={dateRangeModalOpen}
                onRequestClose={handleCloseDateRangeModal}
                onSubmit={handleCalculateWorkHours}  
            />
        </div>
    );
};


const CustomToolbar = (props) => {
    const { label, onNavigate, currentDate } = props;

    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
                <button type="button" onClick={() => onNavigate('TODAY')}>
                    {moment(currentDate).format('MMM D, YYYY')}
                </button>
                <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
            </span>
            <span className="rbc-toolbar-label">{label}</span>
        </div>
    );
};


export default MyCalendar;