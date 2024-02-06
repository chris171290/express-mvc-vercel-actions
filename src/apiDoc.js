import swaggerUI from 'swagger-ui-express'
import { readFile } from 'fs/promises'

const CSS_URL = '/public/swagger-ui2.css'
const FAVICON_URL = '/public/favicon-32x32.png'

const swaggerJson = JSON.parse(await readFile(new URL('./swagger.json', import.meta.url)))

const swaggerUIOptions = {
  explorer: true,
  customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
  customCssUrl: CSS_URL,
  customfavIcon: FAVICON_URL,
  swaggerOptions: {
    // deepLinking: true,
    // defaultModelExpandDepth: 3,
    defaultModelsExpandDepth: -1, // no show models
    operationsSorter: 'alpha'
  }
}

export const swaggerDocs = (app) => {
  app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJson, swaggerUIOptions))
}
