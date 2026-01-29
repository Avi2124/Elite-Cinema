import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows } from "../controller/showController.js";
import adminAuth from "../middleware/adminAuth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', adminAuth, getNowPlayingMovies)
showRouter.post('/add', adminAuth, addShow)
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShow)

export default showRouter;