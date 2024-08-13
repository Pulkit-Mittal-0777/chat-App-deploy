const mongoose =require("mongoose");
const User =require("./User.js");
const Message = require("./Message.js");
const conversationSchema = new mongoose.Schema(
    {
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: User,
            },
        ],
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Message,
                default: [],
            },
        ],
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports= Conversation;