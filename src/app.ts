import express from 'express';
import bodyParser from 'body-parser';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', jobRoutes);

export default app;