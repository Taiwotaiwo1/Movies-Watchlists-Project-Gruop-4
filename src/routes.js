import express from 'express';
import { 
  getAllMovies, 
  getMovieById, 
  createMovie, 
  getUnwatchedMovies, 
  updateMovie, 
  deleteMovieById 
} from './services.js';
import { validateUpdateMovie } from './utils.js';

const router = express.Router();

// get all movies
router.get("/", async(req, res) =>{
  const movies = await getAllMovies();
  res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
  });
});

// create movies:
router.post("/", async (req, res) =>{
    const newMovie = await createMovie(req.body);
    res.status(201).json({
        success: true,
        message: "Movie created successfully",
        data: newMovie
    });
});

// get unwatched movies
router.get("/unwatched", async (req, res)=>{
    const movies = await getUnwatchedMovies();

    res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
    });
});

// get movie by id
router.get("/:id", async (req, res)=>{
    const { id } = req.params;
    const movie = await getMovieById(id);

    if(!movie){
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });  
    }
    res.status(200).json({
        success: true,
        data: movie
    });
});

// PUT update movie endpoint
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    // 1. Validate incoming data
    const validation = validateUpdateMovie(req.body);
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            message: validation.message
        });
    }

    // 2. Perform the update via services
    const updatedMovie = await updateMovie(id, req.body);

    if (!updatedMovie) {
        return res.status(404).json({
            success: false,
            message: "Movie not found"
        });
    }

    // 3. Send success response
    res.status(200).json({
        success: true,
        message: "Movie updated successfully",
        data: updatedMovie
    });
});

// delete movies
router.delete("/:id", async (req, res) =>{
    const { id } = req.params;

    const deleted = await deleteMovieById(id);

    if(!deleted){
        return res.status(404).json({
            success: false,
            message: "Movie not found"
        });
    }
    res.status(204).send();
});

export default router;