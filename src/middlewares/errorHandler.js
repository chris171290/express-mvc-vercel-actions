export const errorLogger = (error, request, response, next) => {
  console.log(`error ${error.message}`)
  next(error) // calling next middleware
}

export const errorResponder = (error, request, response, next) => {
  const status = error.status || 400
  const errMsg = error.message || 'Something went wrong'
  console.trace(error.stack)
  response.status(status).json({
    success: false,
    status,
    message: errMsg,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : {}
  })
}

export const invalidPathHandler = (request, response, next) => {
  response.status(404)
  response.json({ statusCode: '404', mesagge: 'invalid path' })
}
