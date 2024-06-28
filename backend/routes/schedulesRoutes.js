const express = require('express');
const db = require('../database');
const router = express.Router();

router.post('/adding', (req, res) => {
    const { instructorName, subjectName, section, group, courseType, roomName, selectedColor, meetingDay, startTime, endTime } = req.body;

    const sql = `
        INSERT INTO schedules (instructor, subject, section_name, section_group, class_type, room, background_color, day, start_time, end_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [instructorName, subjectName, section, group, courseType, roomName, selectedColor, meetingDay, startTime, endTime], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to add schedule' });
        }
        res.status(200).json({ message: 'Schedule added successfully' });
    });
});

router.get('/fetch', (req, res) => {
    const sql = "SELECT * FROM schedules";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Failed to fetch schedules' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
