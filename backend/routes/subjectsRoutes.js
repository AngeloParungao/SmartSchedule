const express = require('express');
const db = require('../database');
const router = express.Router();


router.post('/adding', (req, res) => {
    const { subjectName , subjectCode, yearLvl , subjectType , subjectUnits , subjectTags } = req.body;

    const sql = "INSERT INTO subjects (subject_name, subject_code, year_lvl, subject_type, subject_units, subject_tags) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [subjectName , subjectCode, yearLvl , subjectType , subjectUnits , subjectTags], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to add subjectId' });
        }
        res.status(200).json({ message: 'Subject added successfully' });
    });
});


router.get('/fetch', (req, res) => {
    const sql = "SELECT * FROM subjects";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching subjects:', err);
            return res.status(500).json({ error: 'Failed to fetch subjects' });
        }
        res.status(200).json(results);
    });
});


router.delete('/delete', (req, res) => {
    const { subjectIds } = req.body;


    if (!subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
        return res.status(400).json({ error: 'Invalid subjectId IDs provided' });
    }


    const sql = "DELETE FROM subjects WHERE subject_id IN (?)";

    db.query(sql, [subjectIds], (err, result) => {
        if (err) {
            console.error('Error deleting subjectId:', err);
            return res.status(500).json({ error: 'Failed to delete subjectId' });
        }
        res.status(200).json({ message: 'Subjects deleted successfully' });
    });
});


router.put('/update/:id', (req, res) => {
    const subjectId = req.params.id;
    const { subjectName , subjectCode, yearLvl , subjectType , subjectUnits , subjectTags } = req.body;

    const sql = "UPDATE subjects SET subject_name = ?, subject_code = ?, year_lvl = ?, subject_type = ?, subject_units = ?, subject_tags = ? WHERE subject_id = ?";

    db.query(sql, [subjectName , subjectCode, yearLvl , subjectType , subjectUnits , subjectTags, subjectId], (err, result) => {
        if (err) {
            console.error('Error updating subjectId:', err);
            return res.status(500).json({ error: 'Failed to update subjectId' });
        }
        res.status(200).json({ message: 'Subject updated successfully' });
    });
});


module.exports = router;
