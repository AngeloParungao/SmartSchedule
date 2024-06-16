//server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const instructorsRoutes = require('./routes/instructorsRoutes');
const sectionsRoutes = require('./routes/sectionsRoutes');
const subjectsRoutes = require('./routes/subjectsRoutes');
const roomsRoutes = require('./routes/roomsRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/instructors', instructorsRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/rooms', roomsRoutes);

app.listen(8082, () => {
    console.log("Server is listening on port 8082");
});
