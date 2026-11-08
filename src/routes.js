import express from 'express';
import { getAllMovies,getMovieById,createMovie, getUnwatchedMovies, } from './services';
const router = express.Router();

// get all movies
router.get("/movies", async(req, res) =>{
const movies = await getAllMovies();
res.status(200).json({
    success: true,
    count: movies.length,
    data: movies
})
});

// get movie by id
router.get("/:1d", async (req, res)=>{
    const{id} = req.params;
    const movie = getMovieById(id);

    if(!movie){
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      })  
    }
    res.status(200).json({
        success: true,
        data: movie
    })
})

// get unWached movies
router.get("/unwatched", async (req, res)=>{
    const movies = await getUnwatchedMovies();
    res.status(200).json({
        success:true,
        count: movies.length,
        data: movies
    })
})