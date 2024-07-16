import express from "express"
import { createUser } from "../controllers/userContoller.js"

const router = express.Router()

router.post("/register", createUser)

export default router