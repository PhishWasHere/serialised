import 'dotenv/config'
import express from 'express'

import { clientStart } from './config'

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`\x1b[35m> Ready!\x1b[0m Server running on port ${port}`)
    clientStart()
})

// import { getSingle } from './interaction/scraper/get-single'
// getSingle('Vampeerz');