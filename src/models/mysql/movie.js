import mysql from 'mysql2/promise'

/* const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'CdkMysql123',
  database: 'moviesdb'
} */

const connection = await mysql.createConnection(process.env.DATABASE_URL)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) { // si existe genre
      const lowerCaseGenre = genre.toLowerCase()

      const query = 'SELECT id FROM genre WHERE LOWER(name) = ?'

      const [genres] = await connection.query(query, [lowerCaseGenre])

      if (genres.length === 0) return []

      const [{ id: idGenre }] = genres

      const queryByGenre = `
      SELECT BIN_TO_UUID(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate, g.name
      FROM movie m
      INNER JOIN movie_genre mg ON mg.movie_id = m.id 
      INNER JOIN genre g ON mg.genre_id = g.id
      WHERE g.id = ?`

      const [moviesByGenre] = await connection.query(queryByGenre, [idGenre])
      return moviesByGenre
    }

    const [movies] = await connection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie')
    return movies
  }

  static async getById ({ id }) {
    if (!id) return []

    const query = `
    SELECT BIN_TO_UUID(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate
    FROM movie m
    WHERE m.id = UUID_TO_BIN(?)`

    const [movieById] = await connection.query(query, [id])
    if (movieById.length === 0) return []

    return movieById
  }

  static async create ({ input }) {
    const { title, year, director, duration, rate, poster, genre } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    const queryMovieInsert = `
    INSERT INTO movie (id, title, year, director, duration, poster, rate) 
    VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`

    const queryMovieGenreInsert = `
    INSERT INTO movie_genre ( movie_id, genre_id)
    SELECT m.id, g.id
    FROM movie m
    RIGHT JOIN genre g ON g.name in (?)
    WHERE m.id = UUID_TO_BIN(?);`

    try {
      await connection.query(queryMovieInsert, [uuid, title, year, director, duration, poster, rate])
      await connection.query(queryMovieGenreInsert, [genre, uuid])
    } catch (e) {
      // debemos controlar que el error no se lo podemos mostrar al usuario
      // es decir que el error que nos envia mysql debemo no podemos mostrartlo
      // por lo que debemos usar una try catch al insertar info a la base de datos
      // para manejar algun error
      console.log(e)
      throw new Error('Error creating movie')
      // aqui podriamos usar algun servicio interno y enviar la traza del error
      // para verlo luego
    }

    const querySelect = `
    SELECT BIN_TO_UUID(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate
    FROM movie m
    WHERE m.id = UUID_TO_BIN(?)`

    const [movieById] = await connection.query(querySelect, [uuid])
    if (movieById.length === 0) return []

    return movieById
  }

  static async delete ({ id }) {
    if (!id) return []

    const query = `
    delete from movie WHERE id = UUID_TO_BIN(?);`

    await connection.query(query, [id])

    return true
  }

  static async update ({ id, input }) {
    const queryUpdate = `
    UPDATE movie
    SET ?
    WHERE id= UUID_TO_BIN(?);`

    await connection.query(queryUpdate, [input, id])

    const query = `
    SELECT BIN_TO_UUID(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate
    FROM movie m
    WHERE m.id = UUID_TO_BIN(?)`

    const [movieById] = await connection.query(query, [id])
    if (movieById.length === 0) return []

    return movieById
  }
}
