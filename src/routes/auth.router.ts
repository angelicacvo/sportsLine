import { Router } from 'express'
import { loginController, registrationController, refreshController } from '../controllers/auth.controller.ts'
import { validateBody } from '../middlewares/validation.middleware.ts'
import { registerSchema, loginSchema } from '../schemas/auth.schema.ts'

export const router = Router()

router.post('/register', validateBody(registerSchema), registrationController)
router.post('/login', validateBody(loginSchema), loginController)
router.post('/refresh', refreshController)
