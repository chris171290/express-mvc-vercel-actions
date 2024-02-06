import cors from 'cors'

export const corsMiddleware = () => cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'https://express-mvc-five.vercel.app',
      'https://express-mvc-vercel-actions-preview.vercel.app',
      'https://express-mvc-vercel-actions.vercel.app'
    ]

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
