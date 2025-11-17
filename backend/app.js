const express = require('express');
const cors = require("cors");
const path = require("path");
require('dotenv').config();
require("./connection/conn");

const app = express();

// CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",               // frontend local
  "http://localhost:5174",               // admin local
  "https://pranerpujo.vercel.app",       // live frontend
  "https://pranerpujo-admin.vercel.app"  // live admin
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow mobile apps, Postman, curl (no origin)
      if (!origin) return callback(null, true);

      // Check allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // If not allowed
      console.log(" CORS BLOCKED:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  })
);
// Middleware
app.use(express.json());

// Import Routes
const pandelRoutes = require('./routes/pandel');
const themeRoutes = require('./routes/theme');
const artistRoutes = require('./routes/Artists');
const GalleryRoutes = require('./routes/Gallery');
const directionRoutes = require('./routes/map');
const adminRoutes = require('./routes/Admin');
const dashboardRoutes = require('./routes/dashboard');
const awardRoutes = require('./routes/Awards');

app.use("/api/admin", adminRoutes);
// Use Routes
app.use("/api/pandel", pandelRoutes);
app.use("/api/theme", themeRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/gallery", GalleryRoutes);
app.use("/api/map", directionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/awards", awardRoutes);

// Server Start
// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
