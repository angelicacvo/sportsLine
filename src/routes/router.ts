import { Router } from 'express'
import { fileURLToPath } from 'url'
import { dirname, format } from 'path'
import { readdirSync } from 'fs'

// router.ts: dynamic route loader that imports all `*.router.ts` files and mounts them
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PATH_ROUTER = `${__dirname}`
export const router = Router()

const cleanFileName = (fileName: string) => {
    const file = fileName.split('.').shift()
    return file;
}

readdirSync(PATH_ROUTER).filter((fileName) => {
    const cleanName = cleanFileName(fileName)
    if (cleanName !== 'router') {
        import(`./${cleanName}.router.ts`).then((moduleRouter) => {
            router.use(`/${cleanName}`, moduleRouter.router)
            // console.log(`Loaded route: /${cleanName}`)
        }).catch((error) => {
            console.error(`Error loading route ${cleanName}:`, error)
        })
    }
})
