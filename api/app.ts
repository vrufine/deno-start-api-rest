import { Application } from 'https://deno.land/x/oak/mod.ts'
import router from './routes.ts'

const env = Deno.env.toObject()
const HOST = env.HOST || 'localhost'
const PORT = env.PORT || 7070

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Server on http://${HOST}:${PORT}`)

await app.listen(`${HOST}:${PORT}`)
