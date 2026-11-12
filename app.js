import express from 'express';
import movieRoute from './src/routes.js'; // added .js to routes because it is a single file
const port = 3000;
const app = express();


// Middleware to parse JSON from the body
app.use(express.json());


//This creates routes for movies watchlists
app.use("/movies", movieRoute)

// Start server
app.listen(port, (req, res)=>{
    // updated from localhost:${port} to http://localhost:${port}
    console.log(`Server is running on http://localhost:${port}`)
})