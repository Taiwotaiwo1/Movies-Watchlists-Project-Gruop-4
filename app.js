import express from 'express';
import movieRoute from './src/routes.js';
const app = express();


// Middleware to parse JSON from the body
app.use(express.json());


//This creates routes for movies watchlists
app.use("/movies", movieRoute)

export default app;