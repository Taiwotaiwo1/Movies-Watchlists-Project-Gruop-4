import express from 'express';
import { getAllMovies,getMovieById,createMovie, getUnwatchedMovies, deleteMovieById } from './services';
const router = express.Router();

// get all movies
router.get("/", async(req, res) =>{
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

// create movies:
router.post("/", async (req, res) =>{
    const newMovie = await createMovie(req.body);
    res.status(201).json({
        message:"Movie created successfully",
        data: newMovie
    })
})

// delete movies
router.delete("/:id", async (req, res) =>{
    const {id} = req.params;

    const deleted = await deleteMovieById(id);

    if(!deleted){
        return res.status(404).json({
            success: false,
            message: "Movie not found"
        });
    }
    res.status(204).send();
});

// get unWached movies
router.get("/unwatched", async (req, res)=>{
    const movies = await getUnwatchedMovies();
    res.status(200).json({
        success:true,
        count: movies.length,
        data: movies
    })
})

export default router