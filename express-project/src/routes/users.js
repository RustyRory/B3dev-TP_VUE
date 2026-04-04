// routes/users.js
import express from "express"
import User from "../models/User.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "messages",
        localField: "pseudo",
        foreignField: "pseudo",
        as: "msgs"
      }
    },
    {
      $addFields: { messageCount: { $size: "$msgs" } }
    },
    {
      $project: { msgs: 0 }
    },
    {
      $sort: { lastMessageAt: -1 }
    }
  ])
  res.json(users)
})

export default router
