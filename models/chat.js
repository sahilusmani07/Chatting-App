const { kMaxLength } = require("buffer");
const mongoose  = require("mongoose"); 
const { type } = require("os");

const chatSchema=   new mongoose.Schema({
    from:{
        type:String,
        require: true
    },
    to:{
        type: String,
        require: true
    },
    msg:{
        type: String,
        MaxLength:50
    },
    created_at:{
        type: Date
    }
})

const Chat= mongoose.model("Chat",chatSchema);
module.exports=Chat;