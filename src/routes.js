import express from 'express';
import { getAllMovies,getMovieById,createMovie, deleteMovieById, updateMovie, getUnwatchedMovies, updateMovie, updateMovie } from './services.js';
import { validateUpdateMovie } from './utils.js';
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

// create movies:
router.post("/", async (req, res) =>{
    const newMovie = await createMovie(req.body);
    res.status(201).json({
        message:"Movie created successfully",
        data: newMovie
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


// get movie by id
router.get("/:id", async (req, res)=>{
    const{id} = req.params;
    const movie = await getMovieById(id);

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

//update movies
router.put("/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        //call validation function
     const validation = validateUpdateMovie(req.body);
     //const{title, director, year} = req.body;
     
     // check validation result
     if(!validation.valid){
        return res.status(400).json({
            success: false,
            message: validation.message
        });
     }
     // update movie
     const updateMovie = await updateMovie(id, req.body);
     // check if movie exists
     if(!updateMovie){
        return res.status(404).json({
            success: false,
            message: "Movie not found"
        });
     }

     res.status(200).json({
        success: true,
        message: "Movie updated successfully",
        data: updateMovie
     });
    } catch(error) {
        next(error);
    }
});

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

export default router