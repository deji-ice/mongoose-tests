import express from "express"
import dotenv from "dotenv"
import dbConnection from "./db/conn.js"
import userRouter from "./routes/userRoute.js"
import cors from "cors"
import { OTPgenrator } from "./lib/OTPgenerator.js"
dotenv.config()

await dbConnection()
const app = express()
const PORT = 3005
app.use(express.json())
app.use(cors())
app.use("/api/v1/user", userRouter)  

OTPgenrator()  

app.listen(PORT, () => {
console.log(`server is running on port http://localhost:${PORT}`)
})