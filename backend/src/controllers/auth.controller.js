import cloudinary from "../lib/cloudinary.js"
import { ForgetPasswordMessage, WelcomeMessage } from "../lib/mail-message.js"
import { MailNotification } from "../lib/mailNotification.js"
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

            const message = WelcomeMessage(newUser.fullName, newUser.email);

            MailNotification(newUser.email, "Create Account", message).then((sendMessageId) => {
                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: "",
                    sendMailId: sendMessageId,
                })
            }).catch((error) => {
                console.log("Error in node mailer", error.message)
                return res?.status(500).json({ message: "Internal Server Error" })
            });

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

export const sendOTP = async (req, res) => {
    try {
        const emailVerification = await User.findOne({ email: req?.body?.email }).select("-password, -otp");

        if (!emailVerification) {
            return res?.status(404).json({ message: "Email is not found" })
        }

        const { message, number } = ForgetPasswordMessage();

        await User.findOneAndUpdate({ email: req?.body?.email }, { $set: { otp: number } })

        MailNotification(emailVerification?.email, "Forget Password", message).then((sendMessageId) => {
            res.status(200).json({ message: "Mail send successfully...", sendMailId: sendMessageId })
        }).catch((error) => {
            console.log("Error in node mailer", error.message)
            return res?.status(500).json({ message: "Internal Server Error" })
        });

    } catch (error) {
        console.log("Error in sendOTP controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const findUser = await User.findOne({ otp: req?.body?.otp }).select("-password, -otp");
        if (!findUser) return res?.status(400).json({ message: "Invalid OTP" });
        res.status(200).json({ message: "Verify your OTP successfully...", data: findUser })
    } catch (error) {
        console.log("Error in verifyOTP controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}

export const UpdatePassword = async (req, res) => {
    try {
        if (!req?.params?.id) return res?.status(400).json({ message: "Parameter is missing" });
        if (!req?.body?.password) return res?.status(400).json({ message: "Password is required" });
        // hash password
        const slat = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req?.body?.password, slat);
        const updatePassword = await User.findOneAndUpdate({ _id: req?.params?.id }, { $set: { password: hashedPassword, otp: null } })
        res.status(200).json({ message: "Update your password successfully...", data: updatePassword })
    } catch (error) {
        console.log("Error in UpdatePassword controller", error.message)
        return res?.status(500).json({ message: "Internal Server Error" })
    }
}