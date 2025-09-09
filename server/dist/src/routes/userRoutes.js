"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userModel_1 = require("../models/userModel");
const router = (0, express_1.Router)();
// Debug route - list all users
router.get("/debug/users", async (req, res) => {
    try {
        const users = await userModel_1.User.find({}).select('-password -refreshToken');
        return res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
});
router.post("/register", userController_1.registerUser);
router.post("/login", userController_1.loginUser);
exports.default = router;
