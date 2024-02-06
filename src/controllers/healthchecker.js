export class HealthcheckerController {
  check = async (req, res, next) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date(Date.now()).toISOString().slice(0, 10)
    }

    try {
      res.json(healthcheck)
    } catch (error) {
      next(error)
    }
  }
}
