import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moviesFilePath = path.join(__dirname, "../data/movies.json");

// Read data from the movie file
export async function readMovies() {
  try {
    // Check if file path exists first
    if (!moviesFilePath) throw new Error("Invalid file path");

    // Read the file first
    const Movies = await fs.readFile(moviesFilePath, "utf-8");

    // Parse converts the JSON string to javascript object
    const parsedMoviesData = JSON.parse(Movies);
    if (!Array.isArray(parsedMoviesData)) {
      throw new Error("JSON isn't an array");
    }
    return parsedMoviesData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Write the data back to the movie file
export async function writeMovies(movies) {
  await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2));
}

export async function getAllMovies() {
  return await readMovies();
}

// This searches for a movie details using its id. It loops over all the movies and returns a movie with matching ID
export async function getMovieById(id) {
  const movies = await readMovies();

  return movies.find((movie) => movie.id === id) || null;
}

// Create a movie.
export async function createMovie(data) {
  const movies = await readMovies();
  const { title, director, year } = data;
  const now = new Date().toISOString();

  const newMovieData = {
    id: crypto.randomUUID(),
    title,
    director,
    year,
    watched: false,
    createdAt: now,
    updatedAt: now,
  };

  movies.push(newMovieData);
  await writeMovies(movies);
  return newMovieData;
}

// Get list of unwatched movies
export async function getUnwatchedMovies() {
  const movies = await readMovies();

  return movies.filter((movie) => !movie.watched);
}
