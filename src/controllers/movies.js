import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { isUuid } from '../utils.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res, next) => {
    try {
      const { genre } = req.query

      const movies = await this.movieModel.getAll({ genre })
      res.json(movies)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    try {
      const { id } = req.params

      if (!isUuid(id)) return res.status(400).json({ message: 'id invalid' })

      const movie = await this.movieModel.getById({ id })

      if (!movie) return res.status(404).json({ message: 'Movie not found' })

      res.json(movie)
    } catch (error) {
      next(error)
    }
  }

  create = async (req, res, next) => {
    try {
      const result = validateMovie(req.body)

      if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const newMovie = await this.movieModel.create({ input: result.data })

      res.status(201).json(newMovie)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    try {
      const { id } = req.params
      const movieDeleted = await this.movieModel.delete({ id })

      if (!movieDeleted) {
        return res.status(404).json({ message: 'Movie not found' })
      }

      return res.status(200).json({ message: 'Movie deleted' })
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    try {
      const validated = validatePartialMovie(req.body)

      if (validated.error) {
        return res.status(400).json({ error: JSON.parse(validated.error.message) })
      }

      const { id } = req.params

      const updatedMovie = await this.movieModel.update({ id, input: validated.data })

      if (!updatedMovie) return res.status(400).json({ message: 'Error en la actualización' })

      res.json(updatedMovie)
    } catch (error) {
      next(error)
    }
  }
}
