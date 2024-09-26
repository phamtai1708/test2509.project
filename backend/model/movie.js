import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  movieId: String,
  ID: String,
  movieName: String,
  time: String,
  year: String,
  image: String,
  introduce: String,
});
const MovieModel = mongoose.model("movies", movieSchema);
export default MovieModel;
