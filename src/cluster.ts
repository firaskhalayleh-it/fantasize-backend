import cluster from 'cluster';
import ip from 'ip';
import { clusterConfig } from './config/cluster.config';
import 'dotenv/config';

const IP = ip.address();
const { numWorkers, server } = clusterConfig;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    console.log(`Starting ${numWorkers} instances`);
    console.log(`Server will be accessible at http://${IP}:${server.port}`);

    // Fork exactly 3 workers
    for (let i = 0; i < numWorkers; i++) {
        const worker = cluster.fork();
        // Assign a worker ID for easier identification
        worker.send({ workerId: i + 1 });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        console.log('Starting a new worker...');
        const newWorker = cluster.fork();
        // Reassign worker ID
        newWorker.send({ workerId: worker.id });
    });

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });
} else {
    // Add worker message handling
    process.on('message', (msg: any) => {
        if (msg && msg.workerId) {
            console.log(`Worker ${process.pid} initialized with ID: ${msg.workerId}`);
        }
    });
    
    require('./index');
}

// Handle termination
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    if (cluster.isPrimary) {
        for (const id in cluster.workers) {
            cluster.workers[id]?.kill();
        }
    }
    process.exit(0);
});