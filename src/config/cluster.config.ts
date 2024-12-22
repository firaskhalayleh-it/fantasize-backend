import ip from 'ip';

const localIP = ip.address();

export const clusterConfig = {
  // Adjust to however many workers you want
  numWorkers: 3,

  server: {
    // Make sure your environment variable is set, or fallback to 3000
    port: parseInt(process.env.APP_PORT || '3000', 10),
    // Use 0.0.0.0 to listen on all interfaces
    host: '0.0.0.0',

    // You can keep localIP for logging or referencing your LAN IP if desired
    localIP
  },

  // Wide-open CORS config. Adjust as needed.
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'cookie']
  }
};
