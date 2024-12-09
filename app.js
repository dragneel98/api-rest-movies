import express, { json } from 'express' // require -> commonJS
import { randomUUID } from 'node:crypto'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'
import { createRequire } from 'node:module'
import { corsMiddleWare } from './middlewares/cors.js'
import { MoviesRouter } from './router/moviesRouter.js'

const require = createRequire(import.meta.url)
const movies = require('./movies.json')

const app = express()
app.use(json())
app.use(corsMiddleWare())
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express
app.use("/movies", MoviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
