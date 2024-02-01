import request from 'supertest'
import { MovieModel } from '../models/local-file-system/movie.js'
import { apiApp } from '../apiApp.js'

const { app } = apiApp({ movieModel: MovieModel })

describe('GET /v1/movies', () => {
  test('should respond with a 200 status code ', async () => {
    const response = await request(app).get('/v1/movies').send()
    expect(response.status).toBe(200)
  })

  test('should respond with an array ', async () => {
    const response = await request(app).get('/v1/movies').send()
    expect(response.body).toEqual(expect.arrayContaining([]))
    expect(response.body).toBeInstanceOf(Array)
  })

  test('should respond with an content-type application/json in header ', async () => {
    const response = await request(app).get('/v1/movies').send()
    // expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    expect(response.header['content-type']).toEqual(expect.stringContaining('application/json'))
  })
})

describe('GET /v1/movies/{id}', () => {
  describe('success cases', () => {
    const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3'
    test('should respond with a 200 status code ', async () => {
      const response = await request(app).get('/v1/movies/' + id).send()
      expect(response.status).toBe(200)
    })

    test('should respond with an content-type application/json in header ', async () => {
      const response = await request(app).get('/v1/movies/' + id).send()
      expect(response.header['content-type']).toEqual(expect.stringContaining('application/json'))
    })

    test('should respond with an object', async () => {
      const response = await request(app).get('/v1/movies/' + id).send()
      expect(response.body).toBeInstanceOf(Object)
    })
  })

  describe('success cases', () => {
    const wrongId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c'
    const notExistId = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c6'

    test('Given wrong id should respond with a 400 status code ', async () => {
      const response = await request(app).get('/v1/movies/' + wrongId).send()
      expect(response.status).toBe(400)
    })

    test('Given nonexistent id should respond with a 404 status code ', async () => {
      const response = await request(app).get('/v1/movies/' + notExistId).send()
      expect(response.status).toBe(404)
    })
  })
})

describe('POST /v1/movies', () => {
  describe('Given the right object to success', () => {
    const newMovie = {
      title: 'The Godfather 2',
      year: 1990,
      director: 'Francis Ford Coppola',
      duration: 120,
      poster: 'https://product-image.juniqe-production.juniqe.com/media/catalog/product/seo-cache/x800/92/412/92-412-101P/The-Godfather-Naxart-Poster.jpg',
      genre: ['Action', 'Drama'],
      rate: 5
    }
    test('should respond with a 201 status code ', async () => {
      const response = await request(app).post('/v1/movies').send(newMovie)
      expect(response.statusCode).toBe(201)
    })

    test('should respond with an Object ', async () => {
      const response = await request(app).post('/v1/movies').send(newMovie)
      expect(response.body).toBeInstanceOf(Object)
    })

    test('should respond with an content-type application/json in header ', async () => {
      const response = await request(app).post('/v1/movies').send(newMovie)
      // expect(response.header['content-type']).toBe('application/json; charset=utf-8')
      expect(response.header['content-type']).toEqual(expect.stringContaining('application/json'))
    })

    test('should respond with new movie object', async () => {
      const response = await request(app).post('/v1/movies').send(newMovie)
      expect(response.body.id).toBeDefined()
      expect(response.body).toHaveProperty('id')
    })
  })
  describe('when some fields are wrong or missing', () => {
    const wrongObjects = [
      {},
      { title: 'The Godfather 2' },
      { title: 'The Godfather 2', year: 1990 },
      { title: 'The Godfather 2', year: 1990, director: 'Francis Ford Coppola' },
      { title: 'The Godfather 2', year: 1990, director: 'Francis Ford Coppola', duration: 120 },
      { title: 'The Godfather 2', year: 1990, director: 'Francis Ford Coppola', duration: 120, rate: 5 },
      { title: 3456, year: 'text', director: 345, duration: 'text', rate: '5' }
    ]

    test('should respond with a 400 status code', async () => {
      for (const object of wrongObjects) {
        const response = await request(app).post('/v1/movies').send(object)
        expect(response.statusCode).toBe(400)
      }
    })
  })
})
