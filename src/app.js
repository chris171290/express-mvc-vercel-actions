import { apiApp } from './apiApp.js'

export const createApp = ({ movieModel }) => {
  const { app, PORT } = apiApp({ movieModel })

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
    console.log(`Docs are avalaible at http://localhost:${PORT}/api-docs/v1`)
  })
}
