const express = require('express');
const cors = require("cors");
const path = require("path");
require('dotenv').config();
require("./connection/conn");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const pandelRoutes = require('./routes/pandel');
const themeRoutes = require('./routes/theme');
const artistRoutes = require('./routes/Artists');
const GalleryRoutes = require('./routes/Gallery');
const directionRoutes =require('./routes/map');
const adminRoutes = require('./routes/Admin');
const dashboardRoutes = require('./routes/dashboard');
const awardRoutes = require('./routes/Awards');

app.use("/api/admin", adminRoutes);
// Use Routes
app.use("/api/pandel", pandelRoutes);
app.use("/api/theme", themeRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/gallery", GalleryRoutes);
app.use("/api/map",directionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/awards", awardRoutes);

// Server Start
// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
