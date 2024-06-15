const express = require('express');
const db = require('../database');
const router = express.Router();


router.post('/adding', (req, res) => {
    const { roomType, roomName, roomTags } = req.body;

    const sql = "INSERT INTO rooms (room_type, room_name, room_tags) VALUES (?, ?, ?)";

    db.query(sql, [ roomType, roomName, roomTags], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to add room' });
        }
        res.status(200).json({ message: 'Room added successfully' });
    });
});


router.get('/fetch', (req, res) => {
    const sql = "SELECT * FROM rooms";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            return res.status(500).json({ error: 'Failed to fetch rooms' });
        }
        res.status(200).json(results);
    });
});


router.delete('/delete', (req, res) => {
    const { roomIds } = req.body;

    if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
        return res.status(400).json({ error: 'Invalid room IDs provided' });
    }

    const sql = "DELETE FROM rooms WHERE room_id IN (?)";

    db.query(sql, [roomIds], (err, result) => {
        if (err) {
            console.error('Error deleting rooms:', err);
            return res.status(500).json({ error: 'Failed to delete rooms' });
        }
        res.status(200).json({ message: 'Rooms deleted successfully' });
    });
});


router.put('/update/:id', (req, res) => {
    const roomId = req.params.id;
    const { roomType, roomName, roomTags } = req.body;

    const sql = "UPDATE rooms SET room_type = ?, room_name = ?, room_tags = ? WHERE room_id = ?";

    db.query(sql, [roomType, roomName, roomTags, roomId], (err, result) => {
        if (err) {
            console.error('Error updating room:', err);
            return res.status(500).json({ error: 'Failed to update room' });
        }
        res.status(200).json({ message: 'Rooms updated successfully' });
    });
});


module.exports = router;
