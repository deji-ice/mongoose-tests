import User from "../models/userModel.js"

export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({
            status: "success",
            message: "User created successfully",
        });
    } catch (error) {
        res.status(400).send(error);
    }
}