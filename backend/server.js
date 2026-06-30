import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route files
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import albumRoutes from './routes/albums.js';
import photoRoutes from './routes/photos.js';

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Expose static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the FirstCry Intellitots Event Photo Gallery API',
    status: 'Running',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections (log but don't crash)
process.on('unhandledRejection', (err) => {
  console.error(`⚠️  Unhandled Rejection: ${err.message}`);
});
