import { Router } from 'express'
import { loginController, registrationController, refreshController } from '../controllers/auth.controller.ts'

export const router = Router()

router.post('/register', registrationController)
router.post('/login', loginController)
router.post('/refresh', refreshController)
