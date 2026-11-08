import fs from "fs/promises";
import path, { parse } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moviesFilePath = path.join(__dirname, "../data/movies.json");

// Read data from the movie file
async function readMovies() {
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
async function writeMovies(movies) {
  await fs.writeFile(moviesFilePath, JSON.stringify(movies, null, 2))
}
