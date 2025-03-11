import winston from 'winston';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'kirana-service' },
    transports: [
        new winston.transports.Console()
    ]
});

// Only add file transport in production
if (process.env.NODE_ENV === 'production') {
    // Add file logging in production
}

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;

        logger.info({
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent') || 'unknown'
        });
    });

    next();
};

// Custom log levels
export const logMessage = {
    error: (message: string, meta: Record<string, any> = {}) => {
        logger.error(message, meta);
    },
    warn: (message: string, meta: Record<string, any> = {}) => {
        logger.warn(message, meta);
    },
    info: (message: string, meta: Record<string, any> = {}) => {
        logger.info(message, meta);
    },
    debug: (message: string, meta: Record<string, any> = {}) => {
        logger.debug(message, meta);
    }
};

// Health check metrics
let requestCounter = 0;
let errorCounter = 0;

export const incrementRequestCounter = () => {
    requestCounter++;
};

export const incrementErrorCounter = () => {
    errorCounter++;
};

export const getMetrics = () => {
    return {
        uptime: process.uptime(),
        timestamp: Date.now(),
        requests: requestCounter,
        errors: errorCounter,
        memory: process.memoryUsage()
    };
};

export default logger;