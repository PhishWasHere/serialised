import 'dotenv/config'
import express from 'express'
import db from './config/mongo'
import getError from './utils/get-error'

import { clientStart } from './config/discord'

const port = process.env.PORT

const app = express()


db.once('open', async () => {
    console.log(`\x1b[35m> Ready!\x1b[0m Connected to DB`);
    try {
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        app.listen(port, () => {
            console.log(`\x1b[35m> Ready!\x1b[0m Server running on port ${port}`)
            clientStart()
        })
    } catch (err) {
        const errMsg = getError(err)
        throw new Error(errMsg)   
    }
})
    