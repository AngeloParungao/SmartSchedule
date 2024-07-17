const express = require('express');
const db = require('../database');
const router = express.Router();


router.post('/adding', (req, res) => {
    const { email, firstName, middleName, lastName, workType, tags, currentUser} = req.body;

    const sql = "INSERT INTO instructors (email, firstName, middleName, lastName, workType, tags, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [email, firstName, middleName, lastName, workType, tags, currentUser], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to add instructor' });
        }
        res.status(200).json({ message: 'Instructor added successfully' });
    });
});


router.get('/fetch', (req, res) => {
    const { creator_id } = req.query;
    const sql = "SELECT * FROM instructors WHERE creator_id = " + creator_id;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching instructors:', err);
            return res.status(500).json({ error: 'Failed to fetch instructors' });
        }
        res.status(200).json(results);
    });
});


router.delete('/delete', (req, res) => {
    const { instructorIds } = req.body;

    // Check if instructorIds is provided and is an array
    if (!instructorIds || !Array.isArray(instructorIds) || instructorIds.length === 0) {
        return res.status(400).json({ error: 'Invalid instructor IDs provided' });
    }

    // Construct SQL query to delete instructors with matching IDs
    const sql = "DELETE FROM instructors WHERE instructor_id IN (?)";

    db.query(sql, [instructorIds], (err, result) => {
        if (err) {
            console.error('Error deleting instructors:', err);
            return res.status(500).json({ error: 'Failed to delete instructors' });
        }
        res.status(200).json({ message: 'Instructors deleted successfully' });
    });
});


// Update Instructor
router.put('/update/:id', (req, res) => {
    const instructorId = req.params.id;
    const { email, firstName, middleName, lastName, workType, tags } = req.body;

    const sql = "UPDATE instructors SET email = ?, firstName = ?, middleName = ?, lastName = ?, workType = ?, tags = ? WHERE instructor_id = ?";

    db.query(sql, [email, firstName, middleName, lastName, workType, tags, instructorId], (err, result) => {
        if (err) {
            console.error('Error updating instructor:', err);
            return res.status(500).json({ error: 'Failed to update instructor' });
        }
        res.status(200).json({ message: 'Instructor updated successfully' });
    });
});


module.exports = router;
