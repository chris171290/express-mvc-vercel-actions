import { Router } from 'express'
import { HealthcheckerController } from '../controllers/healthchecker.js'

export const createHealthcheckerRouter = () => {
  const healthcheckerRouter = Router()

  const healthController = new HealthcheckerController()

  healthcheckerRouter.get('/', healthController.check)

  return healthcheckerRouter
}
