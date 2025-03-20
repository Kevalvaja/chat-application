import express from "express"
import { createFriends, deleteFriends, getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/users", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)
router.post("/add-friend", protectRoute, createFriends)
router.delete("/delete-friend/:id", protectRoute, deleteFriends)

export default router