import { sequelize } from './src/config/database.config.ts'
import cors from 'cors'
import express from 'express'
import 'dotenv/config'
import { router } from './src/routes/router.ts'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './src/docs/swagger.ts'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const databaseInit = async () => {
    try {
        await sequelize.authenticate();
        console.log('[DB] Database connection successful')

        await sequelize.sync( { alter: true });
        console.log('[DB] Models synchronized')
    } catch (error) {
        console.log('[DB] Error connecting to database', error)
        throw error;
    }
}

const startProgram = async () => {
    try {
        await databaseInit();
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`)
        });
    } catch (error) {
        console.error(`[Server] Start aborted due to database error`, error);
        process.exit(1);
    }
}

startProgram();
