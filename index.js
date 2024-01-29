require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const cors = require('cors')
const profileRouter = require("./routes/profileRouter")

// middlewares
app.use(express.json())
app.use(cors())

// routes
app.get('/', (req, res) => {
    res.status(200).send('Beta Home Server')
})
app.use("/api/v1", profileRouter)


// error routes
app.use((req, res) => {
    res.status(404).send('Resource Not Found')
})

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { dbName: "betahome"})
        app.listen(PORT, () => {
            console.log(`Server running on port : ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
startServer()