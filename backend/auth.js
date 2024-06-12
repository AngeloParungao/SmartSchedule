const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbsmartschedule"
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

app.post('/login', (req, res) => {
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
        return res.status(200).json(data);
    });
});

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: "Failed to retrieve users" });
        }
        return res.status(200).json(data);
    });
});


app.listen(8082, () => {
    console.log("Server is listening on port 8082");
});
