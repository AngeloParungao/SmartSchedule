const express = require('express');
const db = require('../database');
const router = express.Router();


router.post('/adding', (req, res) => {
    const { user_id , action , details , type} = req.body;

    const sql = "INSERT INTO activity (user_id, action, details, type) VALUES (?, ?, ?, ?)";

    db.query(sql, [user_id, action, details, type], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to add history' });
        }
        res.status(200).json({ message: 'History added successfully' });
    });
});

router.get('/fetch', (req, res) => {
    const { user_id } = req.query;
    const sql = "SELECT * FROM activity WHERE user_id =" + user_id;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching activity:', err);
            return res.status(500).json({ error: 'Failed to fetch activity' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
