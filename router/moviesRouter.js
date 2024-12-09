import { Router } from "express";
import { MovieController } from "../controllers/movieController.js";

export const MoviesRouter = Router()

MoviesRouter.get("/", MovieController.getAll)
MoviesRouter.post('/', MovieController.createMovie)

MoviesRouter.get('/:id', MovieController.getById)
MoviesRouter.delete('/:id', MovieController.deleteMovie)
MoviesRouter.patch('/:id', MovieController.updateMovie)