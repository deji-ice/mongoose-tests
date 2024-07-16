import express from "express"
import { createUser, getAllUsers, userLogin } from "../controllers/userContoller.js"
import { verifyJWToken } from "../middlewares/jwtAuth.js"

const router = express.Router()

router.get("/all",verifyJWToken, getAllUsers)
router.post("/register", createUser)
router.post("/login", userLogin)

export default router