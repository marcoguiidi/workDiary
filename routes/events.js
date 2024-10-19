const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authenticateJWT');


router.get('/', authenticateJWT, async (req, res) => {
  try {

      let events = await Event.find({
              createdBy: req.user.id           
      }).populate('createdBy', 'email');

      res.json(events);
  } catch (err) {
      console.error('Server Error:', err);
      res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:id', authenticateJWT, async (req, res) => {
  try {
      const event = await Event.findById(req.params.id)
          .populate('createdBy', 'email'); 
      
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      res.json(event);
  } catch (err) {
      console.error('Server Error:', err);
      res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', authenticateJWT, async (req, res) => {
    const { start, end, color} = req.body;
    try {
      const newEvent = new Event({
        start: start,
        end: end,
        createdBy: req.user.id,
        color: color,
        });


      const savedEvent = await newEvent.save();


      
      res.status(201).json(savedEvent);
    } catch (err) {
      console.error('Error creating event:', err);
      res.status(500).json({ message: 'Server error' });
    }
});


router.put('/:id', authenticateJWT, async (req, res) => {
    try {
      const { start, end, color } = req.body;
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      event.start = start;
      event.end = end;
      event.color = color;
      await event.save();
      
      res.json(event);
    } catch (err) {
      console.error('Update Status Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Event.deleteOne({ _id: event._id });

        res.json({ message: 'Event and all its repetitions deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;