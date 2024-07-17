const express = require('express');
const db = require('../database');
const router = express.Router();


router.post('/adding', (req, res) => {
    const { sectionName , sectionGroup, yearLvl , numberOfStudents , sectionTags, currentUser } = req.body;

    const sql = "INSERT INTO sections (section_name, section_group, year_lvl, number_of_students, section_tags, creator_id) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [sectionName , sectionGroup, yearLvl , numberOfStudents , sectionTags, currentUser], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to add sectionId' });
        }
        res.status(200).json({ message: 'Section added successfully' });
    });
});


router.get('/fetch', (req, res) => {
    const { creator_id } = req.query;
    const sql = "SELECT * FROM sections WHERE creator_id =" + creator_id;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching sections:', err);
            return res.status(500).json({ error: 'Failed to fetch sections' });
        }
        res.status(200).json(results);
    });
});


router.delete('/delete', (req, res) => {
    const { sectionIds } = req.body;


    if (!sectionIds || !Array.isArray(sectionIds) || sectionIds.length === 0) {
        return res.status(400).json({ error: 'Invalid subjectId IDs provided' });
    }


    const sql = "DELETE FROM sections WHERE section_id IN (?)";

    db.query(sql, [sectionIds], (err, result) => {
        if (err) {
            console.error('Error deleting sectionId:', err);
            return res.status(500).json({ error: 'Failed to delete sectionId' });
        }
        res.status(200).json({ message: 'Sections deleted successfully' });
    });
});


router.put('/update/:id', (req, res) => {
    const sectionId = req.params.id;
    const { sectionName , sectionGroup, yearLvl , numberOfStudents , sectionTags } = req.body;

    const sql = "UPDATE sections SET section_name = ?, section_group = ?, year_lvl = ?, number_of_students = ?, section_tags = ? WHERE section_id = ?";

    db.query(sql, [sectionName , sectionGroup, yearLvl , numberOfStudents , sectionTags , sectionId], (err, result) => {
        if (err) {
            console.error('Error updating sectionId:', err);
            return res.status(500).json({ error: 'Failed to update sectionId' });
        }
        res.status(200).json({ message: 'Section updated successfully' });
    });
});


module.exports = router;
