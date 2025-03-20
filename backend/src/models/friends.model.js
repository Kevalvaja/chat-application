import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    friend_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
}, { timestamps: true })

const friendModel = mongoose.model("friends", friendSchema);
export default friendModel;