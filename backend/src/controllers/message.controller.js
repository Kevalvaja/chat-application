import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import friendModel from "../models/friends.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import mongoose from "mongoose";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req?.user?._id;
        // const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        const filteredUsers = await User.aggregate([
            {
                $lookup: {
                    from: "friends",          // 'from' should be the first key
                    localField: "_id",
                    foreignField: "friend_id",
                    as: "Friends_array"
                },
            },
            {
                $unwind: "$Friends_array"
            },
            {
                $match: {
                    $or: [
                        {
                            $and: [
                                {
                                    "Friends_array.friend_id": { $ne: new mongoose.Types.ObjectId(loggedInUserId) }
                                },
                                {
                                    "Friends_array.user_id": new mongoose.Types.ObjectId(loggedInUserId)
                                }
                            ]
                        },
                        {
                            $and: [
                                {
                                    "Friends_array.friend_id": "$$users._id"
                                },
                                {
                                    "Friends_array.user_id": "$$users._id"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                $project: {
                    email: 1,
                    fullName: 1,
                    password: 1,
                    profilePic: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "Friends_array._id": 1,
                    "Friends_array.user_id": 1,
                    "Friends_array.friend_id": 1,
                }
            }
        ])

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const createFriends = async (req, res) => {
    try {
        const { email } = req?.body;

        if (!email) return res?.status(400).json({ message: "Email is required" });

        const findEmail = await User.findOne({ $and: [{ email: email }, { email: { $ne: req?.user?.email } }] }).select("-password");
        if (!findEmail) return res?.status(400).json({ message: "Email is not found" });

        const checkExistFriend = await friendModel.findOne({ $and: [{ user_id: req?.user?._id }, { friend_id: findEmail?._id }] });
        if (checkExistFriend) return res?.status(400).json({ message: "You are already added this user." });

        const newFriends = new friendModel({
            user_id: req?.user?._id,
            friend_id: findEmail?._id
        })

        if (newFriends) {
            await newFriends.save()
            return res?.status(201).json({ message: "New friend added successfully...", data: newFriends })
        }
    } catch (error) {
        console.log("Error in createFriends controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const deleteFriends = async (req, res) => {
    try {
        const userId = req?.params?.id;
        if (!userId) {
            return res?.status(400).json({ message: "Something is missing" })
        }
        await friendModel.deleteOne({ _id: userId });

        return res?.status(200).json({ message: "User remove successfully..." })

    } catch (error) {
        console.log("Error in createFriends controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req?.params;
        const myId = req?.user?._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId }
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req?.body
        const { id: reciverId } = req?.params
        const senderId = req?.user?._id

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl
        })

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(reciverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

