import type { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import yaml from 'js-yaml'
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const setupSwagger = (app: Express) => {
  const yamlPath = join(__dirname, '..', 'docs', 'openapi.yaml')
  const file = fs.readFileSync(yamlPath, 'utf8')
  const swaggerDocument = yaml.load(file) as object
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
