import cluster from 'cluster';
import ip from 'ip';
import { clusterConfig } from './config/cluster.config';
import 'dotenv/config';

// Import the function explicitly
import startServer from './index';

const IP = ip.address();
const { numWorkers, server } = clusterConfig;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numWorkers} worker processes...`);
  console.log(`Server accessible at http://${IP}:${server.port} (if not firewalled).`);

  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    worker.send({ workerId: i + 1 });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code=${code}, signal=${signal}`);
    console.log('Starting a new worker...');
    const newWorker = cluster.fork();
    newWorker.send({ workerId: worker.id });
  });

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
} else {
  process.on('message', (msg: { workerId?: number }) => {
    if (msg.workerId) {
      console.log(`Worker ${process.pid} has ID: ${msg.workerId}`);
    }
  });

  //  <--- Call the server function here:
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  if (cluster.isPrimary) {
    for (const id in cluster.workers) {
      cluster.workers[id]?.kill();
    }
  }
  process.exit(0);
});
    