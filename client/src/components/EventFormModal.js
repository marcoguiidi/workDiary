import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import "../css/EventFormModal.css";

Modal.setAppElement('#root');

const EventFormModal = ({ isOpen, onRequestClose, onSave, event, initialStart }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#007bff');

  useEffect(() => {
    if (event) {
      setStart(moment(event.start).format('YYYY-MM-DDTHH:mm'));
      setEnd(moment(event.end).format('YYYY-MM-DDTHH:mm'));
      setColor(event.color);
    } else {
      const startTime = initialStart ? moment(initialStart) : moment();
      setStart(startTime.format('YYYY-MM-DDTHH:mm'));

      let endTime = startTime.clone().add(1, 'hour');
      setEnd(endTime.format('YYYY-MM-DDTHH:mm'));
      setColor('#007bff');

    }
  }, [event, initialStart]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      start: new Date(start),
      end: new Date(end),
      color
    };
    
    onSave(eventData);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Add/Edit Event" className="event-modal-content" overlayClassName="event-modal-overlay">
      <h2 className="event-modal-title">{event ? 'Edit Event' : 'Add Event'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="event-modal-form-row">
          <div className="event-modal-form-group inline">
            <label>Start date:</label>
            <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
          </div>
          <div className="event-modal-form-group inline">
            <label>End date:</label>
            <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
          </div>
        </div>
        <div className="event-modal-form-row">
          <div className="event-modal-form-group">
            <label>Color:</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
        </div>
        <div className="event-modal-buttons">
          <button type="submit" className="event-modal-save">Save</button>
          <button type="button" className="event-modal-cancel" onClick={onRequestClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
