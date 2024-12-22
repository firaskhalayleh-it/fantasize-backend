import os from 'os';

export const clusterConfig = {
    numWorkers: 3, 
    server: {
      port: parseInt(process.env.APP_PORT || '5000', 10),
      host: '0.0.0.0',
    },
    session: {
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      }
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'cookie']
    }
  };