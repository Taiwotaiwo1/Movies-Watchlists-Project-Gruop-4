import express from 'express';
import movieRoute from './src/routes.js';
import errorHandler from './error-Handler.js';
const app = express();


// Middleware to parse JSON from the body
app.use(express.json());

app.use(errorHandler);


//This creates routes for movies watchlists
app.use("/movies", movieRoute)

export default app;