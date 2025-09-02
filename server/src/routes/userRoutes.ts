import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { User } from "../models/userModel";

const router = Router();

// Debug route - list all users
router.get("/debug/users", async (req, res) => {
  try {
    const users = await User.find({}).select('-password -refreshToken');
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post("/register", registerUser);
router.post("/login", loginUser)

export default router;