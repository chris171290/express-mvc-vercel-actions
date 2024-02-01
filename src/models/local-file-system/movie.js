import crypto from 'node:crypto'
import { readJSON } from '../../utils.js'
const dataMovies = readJSON('../movies.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return dataMovies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return dataMovies
  }

  static async getById ({ id }) {
    return dataMovies.find(movie => movie.id === id)
  }

  static async create ({ input }) {
    const newMovie = {
      id: crypto.randomUUID(), // uuid v4
      ...input
    }

    dataMovies.push(newMovie)

    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = dataMovies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return false

    dataMovies.splice(movieIndex, 1)

    return true
  }

  static async update ({ id, input }) {
    const movieIndex = dataMovies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return false

    dataMovies[movieIndex] = {
      ...dataMovies[movieIndex],
      ...input
    }

    return dataMovies[movieIndex]
  }
}
