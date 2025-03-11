import express from 'express';
import bodyParser from 'body-parser';
import jobRoutes from './routes/jobRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { requestLogger, incrementRequestCounter, incrementErrorCounter } from './utils/logger.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(requestLogger);

// Count requests and errors
app.use((req, res, next) => {
    incrementRequestCounter();
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            incrementErrorCounter();
        }
    });
    next();
});

// Routes
app.use('/api', jobRoutes);
app.use('/', healthRoutes);

export default app;