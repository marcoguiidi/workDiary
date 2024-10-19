import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import axios from 'axios';
import "../css/EventDetailModal.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faTimes, faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root'); 

const EventDetailModal = ({ isOpen, onRequestClose, event, onEdit, onDelete, currentUser }) => {

    if (!event) {
        return null; 
    }

    const isCreator = event.createdBy.email === currentUser;

    return (
        <div className='event-modal-wrapper'>
            <Modal 
                isOpen={isOpen} 
                onRequestClose={onRequestClose} 
                contentLabel="Dettagli Evento"
                className="event-detail-modal-content"
                overlayClassName="event-detail-modal-overlay"
            >
                <button className="event-modal-btn-close" onClick={onRequestClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="event-modal-title">Event Details</h2>
                
                <div>
                    <p><strong>Start:</strong> {new Date(event.start).toLocaleString()}</p>
                    <p><strong>End:</strong> {new Date(event.end).toLocaleString()}</p>
                </div>
                
                <div className="event-modal-btn">    
                    <button className="event-modal-btn-icon event-modal-btn-edit" onClick={() => onEdit(event)}>
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button className="event-modal-btn-icon event-modal-btn-delete" onClick={() => onDelete(event._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default EventDetailModal;
