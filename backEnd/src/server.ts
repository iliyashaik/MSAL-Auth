import http from 'node:http';
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { baseRouter } from './baseRouter';

dotenv.config();

/**
 * Main server file for the backend application.
 * Sets up an Express server and listens on the specified port.
 */
const app = express();
app.use(cors({ origin: 'http://localhost:3994' }));
app.use(express.json());

/**
 * Creates an HTTP server using the Express app.
*/
const server = http.createServer(app);

/**
 * Defines the port on which the server will listen.
*/
const PORT = process.env.PORT || 4449;

app.use("/api", baseRouter);

/**
 * Starts the server and listens on the defined port.
 */
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
