import express from 'express';
import movieRoute from './src/routes.js';
const port = 3000;
const app = express();


// Middleware to parse JSON from the body
app.use(express.json());


//This creates routes for movies watchlists
app.use("/movies", movieRoute)

// Start server
app.listen(port, (req, res)=>{
    console.log(`Server is running on localhost:${port}`)
})