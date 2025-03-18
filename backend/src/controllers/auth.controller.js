import cloudinary from "../lib/cloudinary.js"
import { generateJwtToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req?.body
        if (!fullName || !email || !password) {
            return res?.status(400).json({ message: "All fields are required" });
        }

        // check condition if password less then 6 after that showing message 
        if (password?.length < 6) {
            return res?.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // check email id exists
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exists" })

        // hash password
        const slat = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, slat);

        // insert user
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            profilePic: "",
        })

        if (newUser) {
            // generate jwt token here
            generateJwtToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: "",
            })
        } else {
            return res?.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req?.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid credentials" })

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })

        generateJwtToken(user._id, res);

        res.status(200).json({
            _id: user?._id,
            email: user?.email,
            fullName: user?.fullName,
            profilePic: user?.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res?.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req?.body;
        const userId = req?.user?._id;
        if (!profilePic) {
            return res?.status(400).json({ message: "Profile pic is required" })
        }

        // upload image in cloudinary bucket
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updateUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

        res.status(200).json(updateUser)
    } catch (error) {
        console.log("Error in updateProfile controller", error)
        console.log("Error in updateProfile controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req?.user);
    } catch (error) {
        console.log("Error in logout controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}