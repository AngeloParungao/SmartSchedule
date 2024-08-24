const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const schedulesRoutes = require('./routes/schedulesRoutes');
const instructorsRoutes = require('./routes/instructorsRoutes');
const sectionsRoutes = require('./routes/sectionsRoutes');
const subjectsRoutes = require('./routes/subjectsRoutes');
const roomsRoutes = require('./routes/roomsRoutes');
const activityRoutes = require("./routes/activityRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/schedule', schedulesRoutes);
app.use('/api/instructors', instructorsRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/activity', activityRoutes);

// Use process.env.PORT or default to 8082
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
