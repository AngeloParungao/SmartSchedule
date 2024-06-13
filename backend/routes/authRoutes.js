const express = require('express');
const db = require('../database');
const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: "Login Failed" });
        }
        if (data.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        return res.status(200).json({ message: "Login successful", data });
    });
});

module.exports = router;
